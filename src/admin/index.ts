//deno-lint-ignore-file require-await no-explicit-any no-unused-vars no-inner-declarations
/** @format */

import createRetry from '../retry/index.ts';
import flatten from '../utils/flatten.ts';
import waitFor from '../utils/waitFor.ts';
import groupBy from '../utils/groupBy.ts';
import createConsumer from '../consumer/index.ts';
import { InstrumentationEventEmitter } from '../instrumentation/emitter.ts';
import * as events from './instrumentationEvents.ts';

import { LEVELS } from '../loggers/index.ts';
import {
  KafkaJSNonRetriableError,
  KafkaJSDeleteGroupsError,
  KafkaJSBrokerNotFound,
  KafkaJSDeleteTopicRecordsError,
  KafkaJSAggregateError,
  KafkaJSError
} from '../errors.ts';
import { staleMetadata } from '../protocol/error.ts';
import CONFIG_RESOURCE_TYPES from '../protocol/configResourceTypes.ts';
import ACL_RESOURCE_TYPES from '../protocol/aclResourceTypes.ts';
import ACL_OPERATION_TYPES from '../protocol/aclOperationTypes.ts';
import ACL_PERMISSION_TYPES from '../protocol/aclPermissionTypes.ts';
import RESOURCE_PATTERN_TYPES from '../protocol/resourcePatternTypes.ts';
import Constants from '../constants.ts';

import { GroupDescription, Logger, createTopicsRequest,
createPartitionsRequest, PartitionOffset } from '../../index.d.ts'
import { Cluster } from '../cluster/index.ts'

const { wrapEvent }: any = events.wrap;
const { unwrapEvent }: any = events.unwrap;

const { EARLIEST_OFFSET, LATEST_OFFSET }: 
{ EARLIEST_OFFSET: number, LATEST_OFFSET: number} = Constants;
const { CONNECT, DISCONNECT }:any = events;

const NO_CONTROLLER_ID = -1;

const { values, keys, entries } = Object;
const eventNames = values(events);
const eventKeys = keys(events)
  .map((key) => `admin.events.${key}`)
  .join(', ');

const retryOnLeaderNotAvailable = (fn: any, opts = {}) => {
  const callback = async () => {
    try {
      return await fn();
    } catch (e) {
      if (e.type !== 'LEADER_NOT_AVAILABLE') {
        throw e;
      }
      return false;
    }
  };

  return waitFor(callback, opts);
};

const isConsumerGroupRunning = (description: GroupDescription) =>
  ['Empty', 'Dead'].includes(description.state);
const findTopicPartitions = async (cluster: Cluster, topic: string) => {
  await cluster.addTargetTopic(topic);
  await cluster.refreshMetadataIfNecessary();

  return cluster
    .findTopicPartitionMetadata(topic)
    .map(({ partitionId }: { partitionId: number }) => partitionId)
    .sort();
};
const indexByPartition = (array: any) =>
  array.reduce(
    (obj: any, { partition, ...props }: any) =>
      Object.assign(obj, { [partition]: { ...props } }),
    {}
  );

/**
 *
 * @param {Object} params
 * @param {import("../../types").Logger} params.logger
 * @param {InstrumentationEventEmitter} [params.instrumentationEmitter]
 * @param {import('../../types').RetryOptions} params.retry
 * @param {import("../../types").Cluster} params.cluster
 *
 * @returns {import("../../types").Admin}
 */

export default ({
  logger: rootLogger,
  instrumentationEmitter: rootInstrumentationEmitter,
  retry,
  cluster,
}: {
  logger: Logger,
  instrumentationEmitter: any,
  retry: any,
  cluster: Cluster,
}) => {
  const logger = rootLogger.namespace('Admin');
  const instrumentationEmitter =
    rootInstrumentationEmitter || new InstrumentationEventEmitter();

  /**
   * @returns {Promise}
   */
  const connect = async () => {
    await cluster.connect();
    instrumentationEmitter.emit(CONNECT);
  };

  /**
   * @return {Promise}
   */
  const disconnect = async () => {
    await cluster.disconnect();
    instrumentationEmitter.emit(DISCONNECT);
  };

  /**
   * @return {Promise}
   */
  const listTopics = async () => {
    const { topicMetadata } = await cluster.metadata();
    const topics = topicMetadata.map((t: any) => t.topic);
    return topics;
  };

  /**
   * @param {Object} request
   * @param {array} request.topics
   * @param {boolean} [request.validateOnly=false]
   * @param {number} [request.timeout=5000]
   * @param {boolean} [request.waitForLeaders=true]
   * @return {Promise}
   */
  const createTopics = async ({
    topics,
    validateOnly,
    timeout,
    waitForLeaders = true,
  }: createTopicsRequest["options"]) => {
    if (!topics || !Array.isArray(topics)) {
      throw new KafkaJSNonRetriableError(`Invalid topics array ${topics}`);
    }

    if (topics.filter(({ topic }) => typeof topic !== 'string').length > 0) {
      throw new KafkaJSNonRetriableError(
        'Invalid topics array, the topic names have to be a valid string'
      );
    }

    const topicNames = new Set(topics.map(({ topic }) => topic));
    if (topicNames.size < topics.length) {
      throw new KafkaJSNonRetriableError(
        'Invalid topics array, it cannot have multiple entries for the same topic'
      );
    }

    const retrier = createRetry(retry);

    return retrier(async (bail: any, retryCount: number, retryTime: number) => {
      try {
        await cluster.refreshMetadata();
        const broker = await cluster.findControllerBroker();
        await broker.createTopics({ topics, validateOnly, timeout });

        if (waitForLeaders) {
          const topicNamesArray = Array.from(topicNames.values());
          await retryOnLeaderNotAvailable(
            async () => await broker.metadata(topicNamesArray),
            {
              delay: 100,
              maxWait: timeout,
              timeoutMessage: 'Timed out while waiting for topic leaders',
            }
          );
        }

        return true;
      } catch (e) {
        if (e.type === 'NOT_CONTROLLER') {
          logger.warn('Could not create topics', {
            error: e.message,
            retryCount,
            retryTime,
          });
          throw e;
        }

        if (e instanceof KafkaJSAggregateError) {
          if (
            e.errors.every(
              (error: KafkaJSError) => error.type === 'TOPIC_ALREADY_EXISTS'
            )
          ) {
            return false;
          }
        }

        bail(e);
      }
    });
  };
  /**
   * @param {array} topicPartitions
   * @param {boolean} [validateOnly=false]
   * @param {number} [timeout=5000]
   * @return {Promise<void>}
   */
  const createPartitions = async ({
    topicPartitions,
    validateOnly,
    timeout,
  }: createPartitionsRequest["options"]) => {
    if (!topicPartitions || !Array.isArray(topicPartitions)) {
      throw new KafkaJSNonRetriableError(
        `Invalid topic partitions array ${topicPartitions}`
      );
    }
    if (topicPartitions.length === 0) {
      throw new KafkaJSNonRetriableError(`Empty topic partitions array`);
    }

    if (
      topicPartitions.filter(({ topic }) => typeof topic !== 'string').length >
      0
    ) {
      throw new KafkaJSNonRetriableError(
        'Invalid topic partitions array, the topic names have to be a valid string'
      );
    }

    const topicNames = new Set(topicPartitions.map(({ topic }) => topic));
    if (topicNames.size < topicPartitions.length) {
      throw new KafkaJSNonRetriableError(
        'Invalid topic partitions array, it cannot have multiple entries for the same topic'
      );
    }

    const retrier = createRetry(retry);

    return retrier(async (bail: any, retryCount: number, retryTime: number) => {
      try {
        await cluster.refreshMetadata();
        const broker = await cluster.findControllerBroker();
        await broker.createPartitions({
          topicPartitions,
          validateOnly,
          timeout,
        });
      } catch (e) {
        if (e.type === 'NOT_CONTROLLER') {
          logger.warn('Could not create topics', {
            error: e.message,
            retryCount,
            retryTime,
          });
          throw e;
        }

        bail(e);
      }
    });
  };

  /**
   * @param {string[]} topics
   * @param {number} [timeout=5000]
   * @return {Promise}
   */
  const deleteTopics = async ({ topics, timeout }: {topics: string[], timeout: number}) => {
    if (!topics || !Array.isArray(topics)) {
      throw new KafkaJSNonRetriableError(`Invalid topics array ${topics}`);
    }

    if (topics.filter((topic) => typeof topic !== 'string').length > 0) {
      throw new KafkaJSNonRetriableError(
        'Invalid topics array, the names must be a valid string'
      );
    }

    const retrier = createRetry(retry);

    return retrier(async (bail: any, retryCount: number, retryTime: number) => {
      try {
        await cluster.refreshMetadata();
        const broker = await cluster.findControllerBroker();
        await broker.deleteTopics({ topics, timeout });

        // Remove deleted topics
        for (const topic of topics) {
          cluster.targetTopics.delete(topic);
        }

        await cluster.refreshMetadata();
      } catch (e) {
        if (['NOT_CONTROLLER', 'UNKNOWN_TOPIC_OR_PARTITION'].includes(e.type)) {
          logger.warn('Could not delete topics', {
            error: e.message,
            retryCount,
            retryTime,
          });
          throw e;
        }

        if (e.type === 'REQUEST_TIMED_OUT') {
          logger.error(
            'Could not delete topics, check if "delete.topic.enable" is set to "true" (the default value is "false") or increase the timeout',
            {
              error: e.message,
              retryCount,
              retryTime,
            }
          );
        }

        bail(e);
      }
    });
  };

  /**
   * @param {string} topic
   */

  const fetchTopicOffsets = async (topic: string) => {
    if (!topic || typeof topic !== 'string') {
      throw new KafkaJSNonRetriableError(`Invalid topic ${topic}`);
    }

    const retrier = createRetry(retry);

    return retrier(async (bail: any, retryCount: number, retryTime: number) => {
      try {
        await cluster.addTargetTopic(topic);
        await cluster.refreshMetadataIfNecessary();

        const metadata = cluster.findTopicPartitionMetadata(topic);
        const high = await cluster.fetchTopicsOffset([
          {
            topic,
            fromBeginning: false,
            partitions: metadata.map((p: Record<string, number>) => ({
              partition: p.partitionId,
            })),
          },
        ]);

        const low = await cluster.fetchTopicsOffset([
          {
            topic,
            fromBeginning: true,
            partitions: metadata.map((p: Record<string, number>) => ({
              partition: p.partitionId,
            })),
          },
        ]);
        //@ts-ignore - partitions should exist on this type - refactor this
        const { partitions: highPartitions } = high.pop();
        //@ts-ignore - see above
        const { partitions: lowPartitions } = low.pop();
        return highPartitions.map(({ partition, offset }: any) => ({
          partition,
          offset,
          high: offset,
          low: lowPartitions.find(
            ({ partition: lowPartition }: any) => lowPartition === partition
          ).offset,
        }));
      } catch (e: any) {
        if (e.type === 'UNKNOWN_TOPIC_OR_PARTITION') {
          await cluster.refreshMetadata();
          throw e;
        }

        bail(e);
      }
    });
  };

  /**
   * @param {string} topic
   * @param {number} [timestamp]
   */

  const fetchTopicOffsetsByTimestamp = async (topic: string, timestamp: number) => {
    if (!topic || typeof topic !== 'string') {
      throw new KafkaJSNonRetriableError(`Invalid topic ${topic}`);
    }

    const retrier = createRetry(retry);

    return retrier(async (bail: any, retryCount: number, retryTime: number) => {
      try {
        await cluster.addTargetTopic(topic);
        await cluster.refreshMetadataIfNecessary();

        const metadata = cluster.findTopicPartitionMetadata(topic);
        const partitions: any = metadata.map((p: any) => ({
          partition: p.partitionId,
        }));

        const high = await cluster.fetchTopicsOffset([
          {
            topic,
            fromBeginning: false,
            partitions,
          },
        ]);
        //@ts-ignore - partitions should be on this type
        const { partitions: highPartitions } = high.pop();

        const offsets = await cluster.fetchTopicsOffset([
          {
            topic,
            fromTimestamp: timestamp,
            partitions,
          },
        ]);
        //@ts-ignore - partitions should be on this type
        const { partitions: lowPartitions } = offsets.pop();

        return lowPartitions.map(({ partition, offset }: PartitionOffset) => ({
          partition,
          offset:
            parseInt(offset, 10) >= 0
              ? offset
              : highPartitions.find(
                  ({ partition: highPartition }: any) =>
                    highPartition === partition
                ).offset,
        }));
      } catch (e: any) {
        if (e.type === 'UNKNOWN_TOPIC_OR_PARTITION') {
          await cluster.refreshMetadata();
          throw e;
        }

        bail(e);
      }
    });
  };

  /**
   * Fetch offsets for a topic or multiple topics
   *
   * Note: set either topic or topics but not both.
   *
   * @param {string} groupId
   * @param {string} topic - deprecated, use the `topics` parameter. Topic to fetch offsets for.
   * @param {string[]} topics - list of topics to fetch offsets for, defaults to `[]` which fetches all topics for `groupId`.
   * @param {boolean} [resolveOffsets=false]
   * @return {Promise}
   */
  const fetchOffsets = async ({
    groupId,
    topic,
    topics,
    resolveOffsets = false,
  }:{
    groupId: string;
    topic: string;
    topics: string[]
    resolveOffsets?: boolean;
  }) => {
    if (!groupId) {
      throw new KafkaJSNonRetriableError(`Invalid groupId ${groupId}`);
    }

    if (!topic && !topics) {
      topics = [];
    }

    if (!topic && !Array.isArray(topics)) {
      throw new KafkaJSNonRetriableError(
        `Expected topic or topics array to be set`
      );
    }

    if (topic && topics) {
      throw new KafkaJSNonRetriableError(
        `Either topic or topics must be set, not both`
      );
    }

    if (topic) {
      topics = [topic];
    }

    const coordinator = await cluster.findGroupCoordinator({ groupId });
    const topicsToFetch = await Promise.all(
      topics.map(async (topic: string) => {
        const partitions = await findTopicPartitions(cluster, topic);
        const partitionsToFetch = partitions.map((partition: any) => ({
          partition,
        }));
        return { topic, partitions: partitionsToFetch };
      })
    );
    let { responses: consumerOffsets } = await coordinator.offsetFetch({
      groupId,
      topics: topicsToFetch,
    });

    if (resolveOffsets) {
      consumerOffsets = await Promise.all(
        consumerOffsets.map(async ({ topic, partitions }: any) => {
          const indexedOffsets = indexByPartition(
            await fetchTopicOffsets(topic)
          );
          const recalculatedPartitions = partitions.map(
            ({ offset, partition, ...props }: any) => {
              let resolvedOffset = offset;
              if (Number(offset) === EARLIEST_OFFSET) {
                resolvedOffset = indexedOffsets[partition].low;
              }
              if (Number(offset) === LATEST_OFFSET) {
                resolvedOffset = indexedOffsets[partition].high;
              }
              return {
                partition,
                offset: resolvedOffset,
                ...props,
              };
            }
          );

          await setOffsets({
            groupId,
            topic,
            partitions: recalculatedPartitions,
          });

          return {
            topic,
            partitions: recalculatedPartitions,
          };
        })
      );
    }

    const result = consumerOffsets.map(({ topic, partitions }: any) => {
      const completePartitions = partitions.map(
        ({ partition, offset, metadata }: any) => ({
          partition,
          offset,
          metadata: metadata || null,
        })
      );

      return { topic, partitions: completePartitions };
    });

    if (topic) {
      return result.pop().partitions;
    } else {
      return result;
    }
  };

  /**
   * @param {string} groupId
   * @param {string} topic
   * @param {boolean} [earliest=false]
   * @return {Promise}
   */
  const resetOffsets = async ({ groupId, topic, earliest = false }: any) => {
    if (!groupId) {
      throw new KafkaJSNonRetriableError(`Invalid groupId ${groupId}`);
    }

    if (!topic) {
      throw new KafkaJSNonRetriableError(`Invalid topic ${topic}`);
    }

    const partitions = await findTopicPartitions(cluster, topic);
    const partitionsToSeek = partitions.map((partition: any) => ({
      partition,
      offset: cluster.defaultOffset({ fromBeginning: earliest }),
    }));

    return setOffsets({ groupId, topic, partitions: partitionsToSeek });
  };

  /**
   * @param {string} groupId
   * @param {string} topic
   * @param {Array<SeekEntry>} partitions
   * @return {Promise}
   *
   * @typedef {Object} SeekEntry
   * @property {number} partition
   * @property {string} offset
   */
  const setOffsets = async ({ groupId, topic, partitions }: any) => {
    if (!groupId) {
      throw new KafkaJSNonRetriableError(`Invalid groupId ${groupId}`);
    }

    if (!topic) {
      throw new KafkaJSNonRetriableError(`Invalid topic ${topic}`);
    }

    if (!partitions || partitions.length === 0) {
      throw new KafkaJSNonRetriableError(`Invalid partitions`);
    }
    //@ts-ignore - check type
    const consumer = createConsumer({
      logger: rootLogger.namespace('Admin', LEVELS.NOTHING),
      cluster,
      groupId,
    });

    await consumer.subscribe({ topic, fromBeginning: true });
    const description = await consumer.describeGroup();

    //@ts-ignore - this should be type GroupDescription
    if (!isConsumerGroupRunning(description)) {
      throw new KafkaJSNonRetriableError(
        `The consumer group must have no running instances, current state: 'Uh-oh'}`
      );
    }

    return new Promise((resolve: any, reject: any) => {
      consumer.on(consumer.events.FETCH, async () =>
        consumer.stop().then(resolve).catch(reject)
      );

      consumer
        .run({
          eachBatchAutoResolve: false,
          //@ts-ignore - fix this type
          eachBatch: async () => true,
        })
        .catch(reject);

      // This consumer doesn't need to consume any data
      consumer.pause([{ topic }]);

      for (const seekData of partitions) {
        consumer.seek({ topic, ...seekData });
      }
    });
  };

  const isBrokerConfig = (type: any) =>
    [
      CONFIG_RESOURCE_TYPES.BROKER,
      CONFIG_RESOURCE_TYPES.BROKER_LOGGER,
    ].includes(type);

  /**
   * Broker configs can only be returned by the target broker
   *
   * @see
   * https://github.com/apache/kafka/blob/821c1ac6641845aeca96a43bc2b946ecec5cba4f/clients/src/main/java/org/apache/kafka/clients/admin/KafkaAdminClient.java#L3783
   * https://github.com/apache/kafka/blob/821c1ac6641845aeca96a43bc2b946ecec5cba4f/clients/src/main/java/org/apache/kafka/clients/admin/KafkaAdminClient.java#L2027
   *
   * @param {Broker} defaultBroker. Broker used in case the configuration is not a broker config
   */
  const groupResourcesByBroker = ({ resources, defaultBroker }: any) =>
    groupBy(resources, async ({ type, name: nodeId }: any) => {
      return isBrokerConfig(type)
        ? await cluster.findBroker({ nodeId: String(nodeId) })
        : defaultBroker;
    });

  /**
   * @param {Array<ResourceConfigQuery>} resources
   * @param {boolean} [includeSynonyms=false]
   * @return {Promise}
   *
   * @typedef {Object} ResourceConfigQuery
   * @property {ConfigResourceType} type
   * @property {string} name
   * @property {Array<String>} [configNames=[]]
   */
  const describeConfigs = async ({ resources, includeSynonyms }: any) => {
    if (!resources || !Array.isArray(resources)) {
      throw new KafkaJSNonRetriableError(
        `Invalid resources array ${resources}`
      );
    }

    if (resources.length === 0) {
      throw new KafkaJSNonRetriableError('Resources array cannot be empty');
    }

    const validResourceTypes = Object.values(CONFIG_RESOURCE_TYPES);
    const invalidType = resources.find(
      (r: any) => !validResourceTypes.includes(r.type)
    );

    if (invalidType) {
      throw new KafkaJSNonRetriableError(
        `Invalid resource type ${invalidType.type}: ${JSON.stringify(
          invalidType
        )}`
      );
    }

    const invalidName = resources.find(
      (r: any) => !r.name || typeof r.name !== 'string'
    );

    if (invalidName) {
      throw new KafkaJSNonRetriableError(
        `Invalid resource name ${invalidName.name}: ${JSON.stringify(
          invalidName
        )}`
      );
    }

    const invalidConfigs = resources.find(
      (r: any) => !Array.isArray(r.configNames) && r.configNames != null
    );

    if (invalidConfigs) {
      const { configNames } = invalidConfigs;
      throw new KafkaJSNonRetriableError(
        `Invalid resource configNames ${configNames}: ${JSON.stringify(
          invalidConfigs
        )}`
      );
    }

    const retrier = createRetry(retry);

    return retrier(async (bail: any, retryCount: number, retryTime: number) => {
      try {
        await cluster.refreshMetadata();
        const controller = await cluster.findControllerBroker();
        const resourcerByBroker = await groupResourcesByBroker({
          resources,
          defaultBroker: controller,
        });

        const describeConfigsAction = async (broker: any) => {
          const targetBroker = broker || controller;
          return targetBroker.describeConfigs({
            resources: resourcerByBroker.get(targetBroker),
            includeSynonyms,
          });
        };

        const brokers = Array.from(resourcerByBroker.keys());
        const responses = await Promise.all(brokers.map(describeConfigsAction));
        const responseResources = responses.reduce(
          (result: any, { resources }: any) => [...result, ...resources],
          []
        );

        return { resources: responseResources };
      } catch (e: any) {
        if (e.type === 'NOT_CONTROLLER') {
          logger.warn('Could not describe configs', {
            error: e.message,
            retryCount,
            retryTime,
          });
          throw e;
        }

        bail(e);
      }
    });
  };

  /**
   * @param {Array<ResourceConfig>} resources
   * @param {boolean} [validateOnly=false]
   * @return {Promise}
   *
   * @typedef {Object} ResourceConfig
   * @property {ConfigResourceType} type
   * @property {string} name
   * @property {Array<ResourceConfigEntry>} configEntries
   *
   * @typedef {Object} ResourceConfigEntry
   * @property {string} name
   * @property {string} value
   */
  const alterConfigs = async ({ resources, validateOnly }: any) => {
    if (!resources || !Array.isArray(resources)) {
      throw new KafkaJSNonRetriableError(
        `Invalid resources array ${resources}`
      );
    }

    if (resources.length === 0) {
      throw new KafkaJSNonRetriableError('Resources array cannot be empty');
    }

    const validResourceTypes = Object.values(CONFIG_RESOURCE_TYPES);
    const invalidType = resources.find(
      (r: any) => !validResourceTypes.includes(r.type)
    );

    if (invalidType) {
      throw new KafkaJSNonRetriableError(
        `Invalid resource type ${invalidType.type}: ${JSON.stringify(
          invalidType
        )}`
      );
    }

    const invalidName = resources.find(
      (r: any) => !r.name || typeof r.name !== 'string'
    );

    if (invalidName) {
      throw new KafkaJSNonRetriableError(
        `Invalid resource name ${invalidName.name}: ${JSON.stringify(
          invalidName
        )}`
      );
    }

    const invalidConfigs = resources.find(
      (r: any) => !Array.isArray(r.configEntries)
    );

    if (invalidConfigs) {
      const { configEntries } = invalidConfigs;
      throw new KafkaJSNonRetriableError(
        `Invalid resource configEntries ${configEntries}: ${JSON.stringify(
          invalidConfigs
        )}`
      );
    }

    const invalidConfigValue = resources.find((r: any) =>
      r.configEntries.some(
        (e: any) => typeof e.name !== 'string' || typeof e.value !== 'string'
      )
    );

    if (invalidConfigValue) {
      throw new KafkaJSNonRetriableError(
        `Invalid resource config value: ${JSON.stringify(invalidConfigValue)}`
      );
    }

    const retrier = createRetry(retry);

    return retrier(async (bail: any, retryCount: number, retryTime: number) => {
      try {
        await cluster.refreshMetadata();
        const controller = await cluster.findControllerBroker();
        const resourcerByBroker = await groupResourcesByBroker({
          resources,
          defaultBroker: controller,
        });

        const alterConfigsAction = async (broker: any) => {
          const targetBroker = broker || controller;
          return targetBroker.alterConfigs({
            resources: resourcerByBroker.get(targetBroker),
            validateOnly: !!validateOnly,
          });
        };

        const brokers = Array.from(resourcerByBroker.keys());
        const responses = await Promise.all(brokers.map(alterConfigsAction));
        const responseResources = responses.reduce(
          (result: any, { resources }: any) => [...result, ...resources],
          []
        );

        return { resources: responseResources };
      } catch (e: any) {
        if (e.type === 'NOT_CONTROLLER') {
          logger.warn('Could not alter configs', {
            error: e.message,
            retryCount,
            retryTime,
          });
          throw e;
        }

        bail(e);
      }
    });
  };

  /**
   * @deprecated - This method was replaced by `fetchTopicMetadata`. This implementation
   * is limited by the topics in the target group, so it can't fetch all topics when
   * necessary.
   *
   * Fetch metadata for provided topics.
   *
   * If no topics are provided fetch metadata for all topics of which we are aware.
   * @see https://kafka.apache.org/protocol#The_Messages_Metadata
   *
   * @param {Object} [options]
   * @param {string[]} [options.topics]
   * @return {Promise<TopicsMetadata>}
   *
   * @typedef {Object} TopicsMetadata
   * @property {Array<TopicMetadata>} topics
   *
   * @typedef {Object} TopicMetadata
   * @property {String} name
   * @property {Array<PartitionMetadata>} partitions
   *
   * @typedef {Object} PartitionMetadata
   * @property {number} partitionErrorCode Response error code
   * @property {number} partitionId Topic partition id
   * @property {number} leader  The id of the broker acting as leader for this partition.
   * @property {Array<number>} replicas The set of all nodes that host this partition.
   * @property {Array<number>} isr The set of nodes that are in sync with the leader for this partition.
   */
  const getTopicMetadata = async (options: any) => {
    const { topics } = options || {};

    if (topics) {
      await Promise.all(
        topics.map(async (topic: any) => {
          if (!topic) {
            throw new KafkaJSNonRetriableError(`Invalid topic ${topic}`);
          }

          try {
            await cluster.addTargetTopic(topic);
          } catch (e: any) {
            e.message = `Failed to add target topic ${topic}: ${e.message}`;
            throw e;
          }
        })
      );
    }

    await cluster.refreshMetadataIfNecessary();
    const targetTopics = topics || [...cluster.targetTopics];

    return {
      topics: await Promise.all(
        targetTopics.map(async (topic: any) => ({
          name: topic,
          partitions: cluster.findTopicPartitionMetadata(topic),
        }))
      ),
    };
  };

  /**
   * Fetch metadata for provided topics.
   *
   * If no topics are provided fetch metadata for all topics.
   * @see https://kafka.apache.org/protocol#The_Messages_Metadata
   *
   * @param {Object} [options]
   * @param {string[]} [options.topics]
   * @return {Promise<TopicsMetadata>}
   *
   * @typedef {Object} TopicsMetadata
   * @property {Array<TopicMetadata>} topics
   *
   * @typedef {Object} TopicMetadata
   * @property {String} name
   * @property {Array<PartitionMetadata>} partitions
   *
   * @typedef {Object} PartitionMetadata
   * @property {number} partitionErrorCode Response error code
   * @property {number} partitionId Topic partition id
   * @property {number} leader  The id of the broker acting as leader for this partition.
   * @property {Array<number>} replicas The set of all nodes that host this partition.
   * @property {Array<number>} isr The set of nodes that are in sync with the leader for this partition.
   */
  const fetchTopicMetadata = async ({ topics = [] } = {}) => {
    if (topics) {
      topics.forEach((topic) => {
        if (!topic || typeof topic !== 'string') {
          throw new KafkaJSNonRetriableError(`Invalid topic ${topic}`);
        }
      });
    }

    const metadata = await cluster.metadata({ topics });

    return {
      topics: metadata.topicMetadata.map((topicMetadata: any) => ({
        name: topicMetadata.topic,
        partitions: topicMetadata.partitionMetadata,
      })),
    };
  };

  /**
   * Describe cluster
   *
   * @return {Promise<ClusterMetadata>}
   *
   * @typedef {Object} ClusterMetadata
   * @property {Array<Broker>} brokers
   * @property {Number} controller Current controller id. Returns null if unknown.
   * @property {String} clusterId
   *
   * @typedef {Object} Broker
   * @property {Number} nodeId
   * @property {String} host
   * @property {Number} port
   */
  const describeCluster = async () => {
    const {
      brokers: nodes,
      clusterId,
      controllerId,
    } = await cluster.metadata({ topics: [] });
    const brokers = nodes.map(({ nodeId, host, port }: any) => ({
      nodeId,
      host,
      port,
    }));
    const controller =
      controllerId == null || controllerId === NO_CONTROLLER_ID
        ? null
        : controllerId;

    return {
      brokers,
      controller,
      clusterId,
    };
  };

  /**
   * List groups in a broker
   *
   * @return {Promise<ListGroups>}
   *
   * @typedef {Object} ListGroups
   * @property {Array<ListGroup>} groups
   *
   * @typedef {Object} ListGroup
   * @property {string} groupId
   * @property {string} protocolType
   */
  const listGroups = async () => {
    await cluster.refreshMetadata();
    let groups: any = [];
    for (var nodeId in cluster.brokerPool.brokers) {
      const broker = await cluster.findBroker({ nodeId });
      const response = await broker.listGroups();
      groups = groups.concat(response.groups);
    }

    return { groups };
  };

  /**
   * Describe groups by group ids
   * @param {Array<string>} groupIds
   *
   * @typedef {Object} GroupDescriptions
   * @property {Array<GroupDescription>} groups
   *
   * @return {Promise<GroupDescriptions>}
   */
  const describeGroups = async (groupIds: any, p2?: any) => {
    const coordinatorsForGroup = await Promise.all(
      groupIds.map(async (groupId: any) => {
        const coordinator = await cluster.findGroupCoordinator({ groupId });
        return {
          coordinator,
          groupId,
        };
      })
    );

    const groupsByCoordinator = Object.values(
      coordinatorsForGroup.reduce(
        (coordinators: any, { coordinator, groupId }: any) => {
          const group = coordinators[coordinator.nodeId];

          if (group) {
            coordinators[coordinator.nodeId] = {
              ...group,
              groupIds: [...group.groupIds, groupId],
            };
          } else {
            coordinators[coordinator.nodeId] = {
              coordinator,
              groupIds: [groupId],
            };
          }
          return coordinators;
        },
        {}
      ) as Record<string, unknown>
    );

    const responses: any = await Promise.all(
      groupsByCoordinator.map(async ({ coordinator, groupIds }: any) => {
        const retrier = createRetry(retry);
        const { groups: any } = (await retrier(() =>
          coordinator.describeGroups({ groupIds })
        )) as any;
        return groups;
      })
    );

    const groups = [].concat.apply([], responses);

    return { groups };
  };

  /**
   * Delete groups in a broker
   *
   * @param {string[]} [groupIds]
   * @return {Promise<DeleteGroups>}
   *
   * @typedef {Array} DeleteGroups
   * @property {string} groupId
   * @property {number} errorCode
   */
  const deleteGroups = async (groupIds: any) => {
    if (!groupIds || !Array.isArray(groupIds)) {
      throw new KafkaJSNonRetriableError(`Invalid groupIds array ${groupIds}`);
    }

    const invalidGroupId = groupIds.some((g) => typeof g !== 'string');

    if (invalidGroupId) {
      throw new KafkaJSNonRetriableError(
        `Invalid groupId name: ${JSON.stringify(invalidGroupId)}`
      );
    }

    const retrier = createRetry(retry);

    let results = [];

    let clonedGroupIds = groupIds.slice();

    return retrier(async (bail: any, retryCount: number, retryTime: number) => {
      try {
        if (clonedGroupIds.length === 0) return [];

        await cluster.refreshMetadata();

        const brokersPerGroups: any = {};
        const brokersPerNode: any = {};
        for (const groupId of clonedGroupIds) {
          const broker = await cluster.findGroupCoordinator({ groupId });
          if (brokersPerGroups[broker.nodeId] === undefined)
            brokersPerGroups[broker.nodeId] = [];
          brokersPerGroups[broker.nodeId].push(groupId);
          brokersPerNode[broker.nodeId] = broker;
        }

        const res = await Promise.all(
          Object.keys(brokersPerNode).map(
            async (nodeId) =>
              await brokersPerNode[nodeId].deleteGroups(
                brokersPerGroups[nodeId]
              )
          )
        );

        const errors = flatten(
          res.map(({ results }: any) =>
            results.map(({ groupId, errorCode, error }: any) => {
              return { groupId, errorCode, error };
            })
          )
        ).filter(({ errorCode }: any) => errorCode !== 0);

        clonedGroupIds = errors.map(({ groupId }: any) => groupId);

        if (errors.length > 0)
          throw new KafkaJSDeleteGroupsError('Error in DeleteGroups', errors);

        results = flatten(res.map(({ results }: any) => results));

        return results;
      } catch (e: any) {
        if (
          e.type === 'NOT_CONTROLLER' ||
          e.type === 'COORDINATOR_NOT_AVAILABLE'
        ) {
          logger.warn('Could not delete groups', {
            error: e.message,
            retryCount,
            retryTime,
          });
          throw e;
        }

        bail(e);
      }
    });
  };

  /**
   * Delete topic records up to the selected partition offsets
   *
   * @param {string} topic
   * @param {Array<SeekEntry>} partitions
   * @return {Promise}
   *
   * @typedef {Object} SeekEntry
   * @property {number} partition
   * @property {string} offset
   */
  const deleteTopicRecords = async ({ topic, partitions }: any) => {
    if (!topic || typeof topic !== 'string') {
      throw new KafkaJSNonRetriableError(`Invalid topic "${topic}"`);
    }

    if (!partitions || partitions.length === 0) {
      throw new KafkaJSNonRetriableError(`Invalid partitions`);
    }

    const partitionsByBroker = cluster.findLeaderForPartitions(
      topic,
      partitions.map((p: any) => p.partition)
    );

    const partitionsFound : any = flatten(values(partitionsByBroker));
    const topicOffsets: any = await fetchTopicOffsets(topic);

    const leaderNotFoundErrors: any = [];
    partitions.forEach(({ partition, offset }: any) => {
      // throw if no leader found for partition
      if (!partitionsFound.includes(partition)) {
        leaderNotFoundErrors.push({
          partition,
          offset,
          error: new KafkaJSBrokerNotFound(
            'Could not find the leader for the partition',
            {
              retriable: false,
            }
          ),
        });
        return;
      }
      const { low } = topicOffsets.find(
        (p: any) => p.partition === partition
      ) || {
        high: undefined,
        low: undefined,
      };
      // warn in case of offset below low watermark
      if (parseInt(offset) < parseInt(low)) {
        logger.warn(
          'The requested offset is before the earliest offset maintained on the partition - no records will be deleted from this partition',
          {
            topic,
            partition,
            offset,
          }
        );
      }
    });

    if (leaderNotFoundErrors.length > 0) {
      throw new KafkaJSDeleteTopicRecordsError({
        topic,
        partitions: leaderNotFoundErrors,
      });
    }

    const seekEntriesByBroker = entries(partitionsByBroker).reduce(
      (obj: any, [nodeId, nodePartitions]: any) => {
        obj[nodeId] = {
          topic,
          partitions: partitions.filter((p: any) =>
            nodePartitions.includes(p.partition)
          ),
        };
        return obj;
      },
      {}
    );

    const retrier = createRetry(retry);
    return retrier(async (bail: any) => {
      try {
        const partitionErrors: any = [];

        const brokerRequests = entries(seekEntriesByBroker).map(
          ([nodeId, { topic, partitions }]: any) =>
            async () => {
              const broker = await cluster.findBroker({ nodeId });
              await broker.deleteRecords({ topics: [{ topic, partitions }] });
              // remove successful entry so it's ignored on retry
              delete seekEntriesByBroker[nodeId];
            }
        );

        await Promise.all(
          brokerRequests.map((request: any) =>
            request().catch((e: any) => {
              if (e.name === 'KafkaJSDeleteTopicRecordsError') {
                e.partitions.forEach(({ partition, offset, error }: any) => {
                  partitionErrors.push({
                    partition,
                    offset,
                    error,
                  });
                });
              } else {
                // then it's an unknown error, not from the broker response
                throw e;
              }
            })
          )
        );

        if (partitionErrors.length > 0) {
          throw new KafkaJSDeleteTopicRecordsError({
            topic,
            partitions: partitionErrors,
          });
        }
      } catch (e: any) {
        if (
          e.retriable &&
          e.partitions.some(
            ({ error }: any) =>
              staleMetadata(error) || error.name === 'KafkaJSMetadataNotLoaded'
          )
        ) {
          await cluster.refreshMetadata();
        }
        throw e;
      }
    });
  };

  /**
   * @param {Array<ACLEntry>} acl
   * @return {Promise<void>}
   *
   * @typedef {Object} ACLEntry
   */
  const createAcls = async ({ acl }: any) => {
    if (!acl || !Array.isArray(acl)) {
      throw new KafkaJSNonRetriableError(`Invalid ACL array ${acl}`);
    }
    if (acl.length === 0) {
      throw new KafkaJSNonRetriableError('Empty ACL array');
    }

    // Validate principal
    if (acl.some(({ principal }) => typeof principal !== 'string')) {
      throw new KafkaJSNonRetriableError(
        'Invalid ACL array, the principals have to be a valid string'
      );
    }

    // Validate host
    if (acl.some(({ host }) => typeof host !== 'string')) {
      throw new KafkaJSNonRetriableError(
        'Invalid ACL array, the hosts have to be a valid string'
      );
    }

    // Validate resourceName
    if (acl.some(({ resourceName }) => typeof resourceName !== 'string')) {
      throw new KafkaJSNonRetriableError(
        'Invalid ACL array, the resourceNames have to be a valid string'
      );
    }

    let invalidType;
    // Validate operation
    const validOperationTypes = Object.values(ACL_OPERATION_TYPES);
    invalidType = acl.find(
      (i: any) => !validOperationTypes.includes(i.operation)
    );

    if (invalidType) {
      throw new KafkaJSNonRetriableError(
        `Invalid operation type ${invalidType.operation}: ${JSON.stringify(
          invalidType
        )}`
      );
    }

    // Validate resourcePatternTypes
    const validResourcePatternTypes = Object.values(RESOURCE_PATTERN_TYPES);
    invalidType = acl.find(
      (i: any) => !validResourcePatternTypes.includes(i.resourcePatternType)
    );

    if (invalidType) {
      throw new KafkaJSNonRetriableError(
        `Invalid resource pattern type ${
          invalidType.resourcePatternType
        }: ${JSON.stringify(invalidType)}`
      );
    }

    // Validate permissionTypes
    const validPermissionTypes = Object.values(ACL_PERMISSION_TYPES);
    invalidType = acl.find(
      (i: any) => !validPermissionTypes.includes(i.permissionType)
    );

    if (invalidType) {
      throw new KafkaJSNonRetriableError(
        `Invalid permission type ${
          invalidType.permissionType
        }: ${JSON.stringify(invalidType)}`
      );
    }

    // Validate resourceTypes
    const validResourceTypes = Object.values(ACL_RESOURCE_TYPES);
    invalidType = acl.find(
      (i: any) => !validResourceTypes.includes(i.resourceType)
    );

    if (invalidType) {
      throw new KafkaJSNonRetriableError(
        `Invalid resource type ${invalidType.resourceType}: ${JSON.stringify(
          invalidType
        )}`
      );
    }

    const retrier = createRetry(retry);

    return retrier(async (bail: any, retryCount: number, retryTime: number) => {
      try {
        await cluster.refreshMetadata();
        const broker = await cluster.findControllerBroker();
        await broker.createAcls({ acl });

        return true;
      } catch (e: any) {
        if (e.type === 'NOT_CONTROLLER') {
          logger.warn('Could not create ACL', {
            error: e.message,
            retryCount,
            retryTime,
          });
          throw e;
        }

        bail(e);
      }
    });
  };

  /**
   * @param {ACLResourceTypes} resourceType The type of resource
   * @param {string} resourceName The name of the resource
   * @param {ACLResourcePatternTypes} resourcePatternType The resource pattern type filter
   * @param {string} principal The principal name
   * @param {string} host The hostname
   * @param {ACLOperationTypes} operation The type of operation
   * @param {ACLPermissionTypes} permissionType The type of permission
   * @return {Promise<void>}
   *
   * @typedef {number} ACLResourceTypes
   * @typedef {number} ACLResourcePatternTypes
   * @typedef {number} ACLOperationTypes
   * @typedef {number} ACLPermissionTypes
   */
  const describeAcls = async ({
    resourceType,
    resourceName,
    resourcePatternType,
    principal,
    host,
    operation,
    permissionType,
  }: any) => {
    // Validate principal
    if (typeof principal !== 'string' && typeof principal !== 'undefined') {
      throw new KafkaJSNonRetriableError(
        'Invalid principal, the principal have to be a valid string'
      );
    }

    // Validate host
    if (typeof host !== 'string' && typeof host !== 'undefined') {
      throw new KafkaJSNonRetriableError(
        'Invalid host, the host have to be a valid string'
      );
    }

    // Validate resourceName
    if (
      typeof resourceName !== 'string' &&
      typeof resourceName !== 'undefined'
    ) {
      throw new KafkaJSNonRetriableError(
        'Invalid resourceName, the resourceName have to be a valid string'
      );
    }

    // Validate operation
    const validOperationTypes = Object.values(ACL_OPERATION_TYPES);
    if (!validOperationTypes.includes(operation)) {
      throw new KafkaJSNonRetriableError(`Invalid operation type ${operation}`);
    }

    // Validate resourcePatternType
    const validResourcePatternTypes = Object.values(RESOURCE_PATTERN_TYPES);
    if (!validResourcePatternTypes.includes(resourcePatternType)) {
      throw new KafkaJSNonRetriableError(
        `Invalid resource pattern filter type ${resourcePatternType}`
      );
    }

    // Validate permissionType
    const validPermissionTypes = Object.values(ACL_PERMISSION_TYPES);
    if (!validPermissionTypes.includes(permissionType)) {
      throw new KafkaJSNonRetriableError(
        `Invalid permission type ${permissionType}`
      );
    }

    // Validate resourceType
    const validResourceTypes = Object.values(ACL_RESOURCE_TYPES);
    if (!validResourceTypes.includes(resourceType)) {
      throw new KafkaJSNonRetriableError(
        `Invalid resource type ${resourceType}`
      );
    }

    const retrier = createRetry(retry);

    return retrier(async (bail: any, retryCount: number, retryTime: number) => {
      try {
        await cluster.refreshMetadata();
        const broker = await cluster.findControllerBroker();
        const { resources } = await broker.describeAcls({
          resourceType,
          resourceName,
          resourcePatternType,
          principal,
          host,
          operation,
          permissionType,
        });
        return { resources };
      } catch (e: any) {
        if (e.type === 'NOT_CONTROLLER') {
          logger.warn('Could not describe ACL', {
            error: e.message,
            retryCount,
            retryTime,
          });
          throw e;
        }

        bail(e);
      }
    });
  };

  /**
   * @param {Array<ACLFilter>} filters
   * @return {Promise<void>}
   *
   * @typedef {Object} ACLFilter
   */
  const deleteAcls = async ({ filters }: any) => {
    if (!filters || !Array.isArray(filters)) {
      throw new KafkaJSNonRetriableError(`Invalid ACL Filter array ${filters}`);
    }

    if (filters.length === 0) {
      throw new KafkaJSNonRetriableError('Empty ACL Filter array');
    }

    // Validate principal
    if (
      filters.some(
        ({ principal }) =>
          typeof principal !== 'string' && typeof principal !== 'undefined'
      )
    ) {
      throw new KafkaJSNonRetriableError(
        'Invalid ACL Filter array, the principals have to be a valid string'
      );
    }

    // Validate host
    if (
      filters.some(
        ({ host }) => typeof host !== 'string' && typeof host !== 'undefined'
      )
    ) {
      throw new KafkaJSNonRetriableError(
        'Invalid ACL Filter array, the hosts have to be a valid string'
      );
    }

    // Validate resourceName
    if (
      filters.some(
        ({ resourceName }) =>
          typeof resourceName !== 'string' &&
          typeof resourceName !== 'undefined'
      )
    ) {
      throw new KafkaJSNonRetriableError(
        'Invalid ACL Filter array, the resourceNames have to be a valid string'
      );
    }

    let invalidType;
    // Validate operation
    const validOperationTypes = Object.values(ACL_OPERATION_TYPES);
    invalidType = filters.find(
      (i: any) => !validOperationTypes.includes(i.operation)
    );

    if (invalidType) {
      throw new KafkaJSNonRetriableError(
        `Invalid operation type ${invalidType.operation}: ${JSON.stringify(
          invalidType
        )}`
      );
    }

    // Validate resourcePatternTypes
    const validResourcePatternTypes = Object.values(RESOURCE_PATTERN_TYPES);
    invalidType = filters.find(
      (i: any) => !validResourcePatternTypes.includes(i.resourcePatternType)
    );

    if (invalidType) {
      throw new KafkaJSNonRetriableError(
        `Invalid resource pattern type ${
          invalidType.resourcePatternType
        }: ${JSON.stringify(invalidType)}`
      );
    }

    // Validate permissionTypes
    const validPermissionTypes = Object.values(ACL_PERMISSION_TYPES);
    invalidType = filters.find(
      (i: any) => !validPermissionTypes.includes(i.permissionType)
    );

    if (invalidType) {
      throw new KafkaJSNonRetriableError(
        `Invalid permission type ${
          invalidType.permissionType
        }: ${JSON.stringify(invalidType)}`
      );
    }

    // Validate resourceTypes
    const validResourceTypes = Object.values(ACL_RESOURCE_TYPES);
    invalidType = filters.find(
      (i: any) => !validResourceTypes.includes(i.resourceType)
    );

    if (invalidType) {
      throw new KafkaJSNonRetriableError(
        `Invalid resource type ${invalidType.resourceType}: ${JSON.stringify(
          invalidType
        )}`
      );
    }

    const retrier = createRetry(retry);

    return retrier(async (bail: any, retryCount: number, retryTime: number) => {
      try {
        await cluster.refreshMetadata();
        const broker = await cluster.findControllerBroker();
        const { filterResponses } = await broker.deleteAcls({ filters });
        return { filterResponses };
      } catch (e: any) {
        if (e.type === 'NOT_CONTROLLER') {
          logger.warn('Could not delete ACL', {
            error: e.message,
            retryCount,
            retryTime,
          });
          throw e;
        }

        bail(e);
      }
    });
  };

  /**
   * @param {string} eventName
   * @param {Function} listener
   * @return {Function}
   */
  const on = (eventName: any, listener: any) => {
    if (!eventNames.includes(eventName)) {
      throw new KafkaJSNonRetriableError(
        `Event name should be one of ${eventKeys}`
      );
    }

    return instrumentationEmitter.addListener(
      unwrapEvent(eventName),
      (event: any) => {
        event.type = wrapEvent(event.type);
        Promise.resolve(listener(event)).catch((e: any) => {
          logger.error(`Failed to execute listener: ${e.message}`, {
            eventName,
            stack: e.stack,
          });
        });
      }
    );
  };

  /**
   * @return {Object} logger
   */
  const getLogger = () => logger;

  return {
    connect,
    disconnect,
    listTopics,
    createTopics,
    deleteTopics,
    createPartitions,
    getTopicMetadata,
    fetchTopicMetadata,
    describeCluster,
    events,
    fetchOffsets,
    fetchTopicOffsets,
    fetchTopicOffsetsByTimestamp,
    setOffsets,
    resetOffsets,
    describeConfigs,
    alterConfigs,
    on,
    logger: getLogger,
    listGroups,
    describeGroups,
    deleteGroups,
    describeAcls,
    deleteAcls,
    createAcls,
    deleteTopicRecords,
  };
};
