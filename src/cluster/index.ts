/** @format */
// deno-lint-ignore-file no-explicit-any require-await

import BrokerPool from './brokerPool.ts';
import Lock from '../utils/lock.ts';
import createRetry from '../retry/index.ts';
import connectionBuilder from './connectionBuilder.ts';
import flatten from '../utils/flatten.ts';
import Constants from '../constants.ts';
import {
  KafkaJSError,
  KafkaJSBrokerNotFound,
  KafkaJSMetadataNotLoaded,
  KafkaJSTopicMetadataNotLoaded,
  KafkaJSGroupCoordinatorNotFound,
} from '../errors.ts';
import COORDINATOR_TYPES from '../protocol/coordinatorTypes.ts';
import {Logger, ISocketFactory, RetryOptions} from '../../index.d.ts'

const { EARLIEST_OFFSET, LATEST_OFFSET } = Constants;
const { keys } = Object;

const mergeTopics = (obj: any, { topic, partitions }: any) => ({
  ...obj,
  [topic]: [...(obj[topic] || []), ...partitions],
});

export class Cluster {
  brokerPool: any;
  committedOffsetsByGroup: any;
  connectionBuilder: any;
  isolationLevel: number;
  logger: Logger;
  mutatingTargetTopics: any;
  retrier: any;
  rootLogger: Logger;
  targetTopics: Set<string>;
  /**
   * @param {Object} options
   * @param {Array<string>} options.brokers example: ['127.0.0.1:9092', '127.0.0.1:9094']
   * @param {Object} options.ssl
   * @param {Object} options.sasl
   * @param {string} options.clientId
   * @param {number} options.connectionTimeout - in milliseconds
   * @param {number} options.authenticationTimeout - in milliseconds
   * @param {number} options.reauthenticationThreshold - in milliseconds
   * @param {number} [options.requestTimeout=30000] - in milliseconds
   * @param {boolean} [options.enforceRequestTimeout]
   * @param {number} options.metadataMaxAge - in milliseconds
   * @param {boolean} options.allowAutoTopicCreation
   * @param {number} options.maxInFlightRequests
   * @param {number} options.isolationLevel
   * @param {import("../../types").RetryOptions} options.retry
   * @param {import("../../types").Logger} options.logger
   * @param {import("../../types").ISocketFactory} options.socketFactory
   * @param {Map} [options.offsets]
   * @param {import("../instrumentation/emitter")} [options.instrumentationEmitter=null]
   */
  constructor({
    logger: rootLogger,
    socketFactory,
    brokers,
    ssl,
    sasl,
    clientId,
    connectionTimeout,
    authenticationTimeout,
    reauthenticationThreshold,
    requestTimeout = 30000,
    enforceRequestTimeout,
    metadataMaxAge,
    retry,
    allowAutoTopicCreation,
    maxInFlightRequests,
    isolationLevel,
    instrumentationEmitter = null,
    offsets = new Map(),
  }: any) {
    this.rootLogger = rootLogger;
    this.logger = rootLogger.namespace('Cluster');
    this.retrier = createRetry(retry);
    this.connectionBuilder = connectionBuilder({
      logger: rootLogger,
      instrumentationEmitter,
      socketFactory,
      brokers,
      ssl,
      sasl,
      clientId,
      connectionTimeout,
      requestTimeout,
      enforceRequestTimeout,
      maxInFlightRequests,
    });

    this.targetTopics = new Set();
    this.mutatingTargetTopics = new Lock({
      description: `updating target topics`,
      timeout: requestTimeout,
    });
    this.isolationLevel = isolationLevel;
    this.brokerPool = new BrokerPool({
      connectionBuilder: this.connectionBuilder,
      logger: this.rootLogger,
      retry,
      allowAutoTopicCreation,
      authenticationTimeout,
      reauthenticationThreshold,
      metadataMaxAge,
    });
    this.committedOffsetsByGroup = offsets;
  }

  isConnected() {
    return this.brokerPool.hasConnectedBrokers();
  }

  /**
   * @public
   * @returns {Promise<void>}
   */
  async connect() {
    await this.brokerPool.connect();
  }

  /**
   * @public
   * @returns {Promise<void>}
   */
  async disconnect() {
    await this.brokerPool.disconnect();
  }

  /**
   * @public
   * @param {object} destination
   * @param {String} destination.host
   * @param {Number} destination.port
   */
  removeBroker({ host, port }: any) {
    this.brokerPool.removeBroker({ host, port });
  }

  /**
   * @public
   * @returns {Promise<void>}
   */
  async refreshMetadata() {
    await this.brokerPool.refreshMetadata(Array.from(this.targetTopics));
  }

  /**
   * @public
   * @returns {Promise<void>}
   */
  async refreshMetadataIfNecessary() {
    await this.brokerPool.refreshMetadataIfNecessary(
      Array.from(this.targetTopics)
    );
  }

  /**
   * @public
   * @returns {Promise<import("../../types").BrokerMetadata>}
   */

  async metadata({ topics = [] } = {}) {
    return this.retrier(async (bail: any, retryCount: number, retryTime: number) => {
      try {
        await this.brokerPool.refreshMetadataIfNecessary(topics);
        return this.brokerPool.withBroker(async ({ broker }: any) =>
          broker.metadata(topics)
        );
      } catch (e: any) {
        if (e.type === 'LEADER_NOT_AVAILABLE') {
          throw e;
        }

        bail(e);
      }
    });
  }

  /**
   * @public
   * @param {string} topic
   * @return {Promise}
   */
  async addTargetTopic(topic: any) {
    return this.addMultipleTargetTopics([topic]);
  }

  /**
   * @public
   * @param {string[]} topics
   * @return {Promise}
   */
  async addMultipleTargetTopics(topics: any) {
    await this.mutatingTargetTopics.acquire();

    try {
      const previousSize = this.targetTopics.size;
      const previousTopics = new Set(this.targetTopics);
      for (const topic of topics) {
        this.targetTopics.add(topic);
      }

      const hasChanged =
        previousSize !== this.targetTopics.size || !this.brokerPool.metadata;

      if (hasChanged) {
        try {
          await this.refreshMetadata();
        } catch (e: any) {
          if (
            e.type === 'INVALID_TOPIC_EXCEPTION' ||
            e.type === 'UNKNOWN_TOPIC_OR_PARTITION'
          ) {
            this.targetTopics = previousTopics;
          }

          throw e;
        }
      }
    } finally {
      await this.mutatingTargetTopics.release();
    }
  }

  /**
   * @public
   * @param {object} options
   * @param {string} options.nodeId
   * @returns {Promise<import("../../types").Broker>}
   */
  async findBroker({ nodeId }: any) {
    try {
      return await this.brokerPool.findBroker({ nodeId });
    } catch (e: any) {
      // The client probably has stale metadata
      if (
        e.name === 'KafkaJSBrokerNotFound' ||
        e.name === 'KafkaJSLockTimeout' ||
        e.name === 'KafkaJSConnectionError'
      ) {
        await this.refreshMetadata();
      }

      throw e;
    }
  }

  /**
   * @public
   * @returns {Promise<import("../../types").Broker>}
   */
  async findControllerBroker() {
    const { metadata } = this.brokerPool;

    if (!metadata || metadata.controllerId == null) {
      throw new KafkaJSMetadataNotLoaded('Topic metadata not loaded');
    }

    const broker = await this.findBroker({ nodeId: metadata.controllerId });

    if (!broker) {
      throw new KafkaJSBrokerNotFound(
        `Controller broker with id ${metadata.controllerId} not found in the cached metadata`
      );
    }

    return broker;
  }

  /**
   * @public
   * @param {string} topic
   * @returns {import("../../types").PartitionMetadata[]} Example:
   *                   [{
   *                     isr: [2],
   *                     leader: 2,
   *                     partitionErrorCode: 0,
   *                     partitionId: 0,
   *                     replicas: [2],
   *                   }]
   */
  findTopicPartitionMetadata(topic: any) {
    const { metadata } = this.brokerPool;
    if (!metadata || !metadata.topicMetadata) {
      throw new KafkaJSTopicMetadataNotLoaded('Topic metadata not loaded', {
        topic,
      });
    }

    const topicMetadata = metadata.topicMetadata.find(
      (t: any) => t.topic === topic
    );
    return topicMetadata ? topicMetadata.partitionMetadata : [];
  }

  /**
   * @public
   * @param {string} topic
   * @param {(number|string)[]} partitions
   * @returns {Object} Object with leader and partitions. For partitions 0 and 5
   *                   the result could be:
   *                     { '0': [0], '2': [5] }
   *
   *                   where the key is the nodeId.
   */
  findLeaderForPartitions(topic: any, partitions: any) {
    const partitionMetadata = this.findTopicPartitionMetadata(topic);
    return partitions.reduce((result: any, id: any) => {
      const partitionId = parseInt(id, 10);
      const metadata = partitionMetadata.find(
        (p: any) => p.partitionId === partitionId
      );

      if (!metadata) {
        return result;
      }

      if (metadata.leader === null || metadata.leader === undefined) {
        throw new KafkaJSError('Invalid partition metadata', {
          topic,
          partitionId,
          metadata,
        } as { retriable?: boolean | undefined });
      }
      const { leader } = metadata;
      const current = result[leader] || [];
      return { ...result, [leader]: [...current, partitionId] };
    }, {});
  }

  /**
   * @public
   * @param {object} params
   * @param {string} params.groupId
   * @param {import("../protocol/coordinatorTypes").CoordinatorType} [params.coordinatorType=0]
   * @returns {Promise<import("../../types").Broker>}
   */
  async findGroupCoordinator({
    groupId,
    coordinatorType = COORDINATOR_TYPES.GROUP,
  }: any) {
    return this.retrier(async (bail: any, retryCount: any, retryTime: any) => {
      try {
        const { coordinator } = await this.findGroupCoordinatorMetadata({
          groupId,
          coordinatorType,
        });
        return await this.findBroker({ nodeId: coordinator.nodeId });
      } catch (e: any) {
        // A new broker can join the cluster before we have the chance
        // to refresh metadata
        if (
          e.name === 'KafkaJSBrokerNotFound' ||
          e.type === 'GROUP_COORDINATOR_NOT_AVAILABLE'
        ) {
          this.logger.debug(
            `${e.message}, refreshing metadata and trying again...`,
            {
              groupId,
              retryCount,
              retryTime,
            }
          );

          await this.refreshMetadata();
          throw e;
        }

        if (e.code === 'ECONNREFUSED') {
          // During maintenance the current coordinator can go down; findBroker will
          // refresh metadata and re-throw the error. findGroupCoordinator has to re-throw
          // the error to go through the retry cycle.
          throw e;
        }

        bail(e);
      }
    });
  }

  /**
   * @public
   * @param {object} params
   * @param {string} params.groupId
   * @param {import("../protocol/coordinatorTypes").CoordinatorType} [params.coordinatorType=0]
   * @returns {Promise<Object>}
   */
  async findGroupCoordinatorMetadata({ groupId, coordinatorType }: any) {
    const brokerMetadata = await this.brokerPool.withBroker(
      async ({ nodeId, broker }: any) => {
        return await this.retrier(
          async (bail: any, retryCount: any, retryTime: any) => {
            try {
              const brokerMetadata = await broker.findGroupCoordinator({
                groupId,
                coordinatorType,
              });
              this.logger.debug('Found group coordinator', {
                broker: brokerMetadata.host,
                nodeId: brokerMetadata.coordinator.nodeId,
              });
              return brokerMetadata;
            } catch (e: any) {
              this.logger.debug('Tried to find group coordinator', {
                nodeId,
                error: e,
              });

              if (e.type === 'GROUP_COORDINATOR_NOT_AVAILABLE') {
                this.logger.debug(
                  'Group coordinator not available, retrying...',
                  {
                    nodeId,
                    retryCount,
                    retryTime,
                  }
                );

                throw e;
              }

              bail(e);
            }
          }
        );
      }
    );

    if (brokerMetadata) {
      return brokerMetadata;
    }

    throw new KafkaJSGroupCoordinatorNotFound(
      'Failed to find group coordinator'
    );
  }

  /**
   * @param {object} topicConfiguration
   * @returns {number}
   */
  defaultOffset({ fromBeginning }: any) {
    return fromBeginning ? EARLIEST_OFFSET : LATEST_OFFSET;
  }

  /**
   * @public
   * @param {Array<Object>} topics
   *                          [
   *                            {
   *                              topic: 'my-topic-name',
   *                              partitions: [{ partition: 0 }],
   *                              fromBeginning: false
   *                            }
   *                          ]
   * @returns {Promise<import("../../types").TopicOffsets[]>} example:
   *                          [
   *                            {
   *                              topic: 'my-topic-name',
   *                              partitions: [
   *                                { partition: 0, offset: '1' },
   *                                { partition: 1, offset: '2' },
   *                                { partition: 2, offset: '1' },
   *                              ],
   *                            },
   *                          ]
   */
  async fetchTopicsOffset(topics: any) {
    const partitionsPerBroker: any = {};
    const topicConfigurations: any = {};

    const addDefaultOffset = (topic: any) => (partition: any) => {
      const { timestamp } = topicConfigurations[topic];
      return { ...partition, timestamp };
    };

    // Index all topics and partitions per leader (nodeId)
    for (const topicData of topics) {
      const { topic, partitions, fromBeginning, fromTimestamp } = topicData;
      const partitionsPerLeader = this.findLeaderForPartitions(
        topic,
        partitions.map((p: any) => p.partition)
      );
      const timestamp =
        fromTimestamp != null
          ? fromTimestamp
          : this.defaultOffset({ fromBeginning });

      topicConfigurations[topic] = { timestamp };

      keys(partitionsPerLeader).forEach((nodeId) => {
        partitionsPerBroker[nodeId] = partitionsPerBroker[nodeId] || {};
        partitionsPerBroker[nodeId][topic] = partitions.filter((p: any) =>
          partitionsPerLeader[nodeId].includes(p.partition)
        );
      });
    }

    // Create a list of requests to fetch the offset of all partitions
    const requests = keys(partitionsPerBroker).map(async (nodeId) => {
      const broker = await this.findBroker({ nodeId });
      const partitions = partitionsPerBroker[nodeId];

      const { responses: topicOffsets } = await broker.listOffsets({
        isolationLevel: this.isolationLevel,
        topics: keys(partitions).map((topic) => ({
          topic,
          partitions: partitions[topic].map(addDefaultOffset(topic)),
        })),
      });

      return topicOffsets;
    });

    // Execute all requests, merge and normalize the responses
    const responses = await Promise.all(requests);
    const partitionsPerTopic = flatten(responses).reduce(mergeTopics, {});

    return keys(partitionsPerTopic).map((topic) => ({
      topic,
      partitions: partitionsPerTopic[topic].map(
        ({ partition, offset }: any) => ({
          partition,
          offset,
        })
      ),
    }));
  }

  /**
   * Retrieve the object mapping for committed offsets for a single consumer group
   * @param {object} options
   * @param {string} options.groupId
   * @returns {Object}
   */
  committedOffsets({ groupId }: any) {
    if (!this.committedOffsetsByGroup.has(groupId)) {
      this.committedOffsetsByGroup.set(groupId, {});
    }

    return this.committedOffsetsByGroup.get(groupId);
  }

  /**
   * Mark offset as committed for a single consumer group's topic-partition
   * @param {object} options
   * @param {string} options.groupId
   * @param {string} options.topic
   * @param {string|number} options.partition
   * @param {string} options.offset
   */
  markOffsetAsCommitted({ groupId, topic, partition, offset }: any) {
    const committedOffsets = this.committedOffsets({ groupId });

    committedOffsets[topic] = committedOffsets[topic] || {};
    committedOffsets[topic][partition] = offset;
  }
}
