// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BrokerPool... Remove this comment to see the full error message
const BrokerPool = require('./brokerPool')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Lock'.
const Lock = require('../utils/lock')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createRetr... Remove this comment to see the full error message
const createRetry = require('../retry')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'connection... Remove this comment to see the full error message
const connectionBuilder = require('./connectionBuilder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'flatten'.
const flatten = require('../utils/flatten')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EARLIEST_O... Remove this comment to see the full error message
const { EARLIEST_OFFSET, LATEST_OFFSET } = require('../constants')
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSErr... Remove this comment to see the full error message
  KafkaJSError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSBro... Remove this comment to see the full error message
  KafkaJSBrokerNotFound,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSMet... Remove this comment to see the full error message
  KafkaJSMetadataNotLoaded,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSTop... Remove this comment to see the full error message
  KafkaJSTopicMetadataNotLoaded,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSGro... Remove this comment to see the full error message
  KafkaJSGroupCoordinatorNotFound,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'COORDINATO... Remove this comment to see the full error message
const COORDINATOR_TYPES = require('../protocol/coordinatorTypes')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'keys'.
const { keys } = Object

const mergeTopics = (
  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'obj' implicitly has an 'any' type.
  obj,
  {
    topic,
    partitions
  }: any
) => ({
  ...obj,
  [topic]: [...(obj[topic] || []), ...partitions]
})

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class Cluster {
  brokerPool: any;
  committedOffsetsByGroup: any;
  connectionBuilder: any;
  isolationLevel: any;
  logger: any;
  mutatingTargetTopics: any;
  retrier: any;
  rootLogger: any;
  targetTopics: any;
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
    // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Map'. Do you need to change your... Remove this comment to see the full error message
    offsets = new Map()
  }: any) {
    this.rootLogger = rootLogger
    this.logger = rootLogger.namespace('Cluster')
    this.retrier = createRetry(retry)
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
    })

    // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Set'. Do you need to change your... Remove this comment to see the full error message
    this.targetTopics = new Set()
    this.mutatingTargetTopics = new Lock({
      description: `updating target topics`,
      timeout: requestTimeout,
    })
    this.isolationLevel = isolationLevel
    this.brokerPool = new BrokerPool({
      connectionBuilder: this.connectionBuilder,
      logger: this.rootLogger,
      retry,
      allowAutoTopicCreation,
      authenticationTimeout,
      reauthenticationThreshold,
      metadataMaxAge,
    })
    this.committedOffsetsByGroup = offsets
  }

  isConnected() {
    return this.brokerPool.hasConnectedBrokers()
  }

  /**
   * @public
   * @returns {Promise<void>}
   */
  async connect() {
    await this.brokerPool.connect()
  }

  /**
   * @public
   * @returns {Promise<void>}
   */
  async disconnect() {
    await this.brokerPool.disconnect()
  }

  /**
   * @public
   * @param {object} destination
   * @param {String} destination.host
   * @param {Number} destination.port
   */
  removeBroker({
    host,
    port
  }: any) {
    this.brokerPool.removeBroker({ host, port })
  }

  /**
   * @public
   * @returns {Promise<void>}
   */
  // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
  async refreshMetadata() {
    // @ts-expect-error ts-migrate(2550) FIXME: Property 'from' does not exist on type 'ArrayConst... Remove this comment to see the full error message
    await this.brokerPool.refreshMetadata(Array.from(this.targetTopics))
  }

  /**
   * @public
   * @returns {Promise<void>}
   */
  async refreshMetadataIfNecessary() {
    // @ts-expect-error ts-migrate(2550) FIXME: Property 'from' does not exist on type 'ArrayConst... Remove this comment to see the full error message
    await this.brokerPool.refreshMetadataIfNecessary(Array.from(this.targetTopics))
  }

  /**
   * @public
   * @returns {Promise<import("../../types").BrokerMetadata>}
   */
  async metadata({ topics = [] } = {}) {
    return this.retrier(async (bail: any, retryCount: any, retryTime: any) => {
      try {
        await this.brokerPool.refreshMetadataIfNecessary(topics)
        return this.brokerPool.withBroker(async ({
          broker
        }: any) => broker.metadata(topics));
      } catch (e) {
        if (e.type === 'LEADER_NOT_AVAILABLE') {
          throw e
        }

        bail(e)
      }
    });
  }

  /**
   * @public
   * @param {string} topic
   * @return {Promise}
   */
  async addTargetTopic(topic: any) {
    return this.addMultipleTargetTopics([topic])
  }

  /**
   * @public
   * @param {string[]} topics
   * @return {Promise}
   */
  // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
  async addMultipleTargetTopics(topics: any) {
    await this.mutatingTargetTopics.acquire()

    try {
      const previousSize = this.targetTopics.size
      // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Set'. Do you need to change your... Remove this comment to see the full error message
      const previousTopics = new Set(this.targetTopics)
      for (const topic of topics) {
        this.targetTopics.add(topic)
      }

      const hasChanged = previousSize !== this.targetTopics.size || !this.brokerPool.metadata

      if (hasChanged) {
        try {
          await this.refreshMetadata()
        } catch (e) {
          if (e.type === 'INVALID_TOPIC_EXCEPTION' || e.type === 'UNKNOWN_TOPIC_OR_PARTITION') {
            this.targetTopics = previousTopics
          }

          throw e
        }
      }
    } finally {
      await this.mutatingTargetTopics.release()
    }
  }

  /**
   * @public
   * @param {object} options
   * @param {string} options.nodeId
   * @returns {Promise<import("../../types").Broker>}
   */
  async findBroker({
    nodeId
  }: any) {
    try {
      return await this.brokerPool.findBroker({ nodeId })
    } catch (e) {
      // The client probably has stale metadata
      if (
        e.name === 'KafkaJSBrokerNotFound' ||
        e.name === 'KafkaJSLockTimeout' ||
        e.name === 'KafkaJSConnectionError'
      ) {
        await this.refreshMetadata()
      }

      throw e
    }
  }

  /**
   * @public
   * @returns {Promise<import("../../types").Broker>}
   */
  async findControllerBroker() {
    const { metadata } = this.brokerPool

    if (!metadata || metadata.controllerId == null) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
      throw new KafkaJSMetadataNotLoaded('Topic metadata not loaded')
    }

    const broker = await this.findBroker({ nodeId: metadata.controllerId })

    if (!broker) {
      throw new KafkaJSBrokerNotFound(        
// @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.

        `Controller broker with id ${metadata.controllerId} not found in the cached metadata`
      )
    }

    return broker
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
    const { metadata } = this.brokerPool
    if (!metadata || !metadata.topicMetadata) {
      throw new KafkaJSTopicMetadataNotLoaded('Topic metadata not loaded', { topic })
    }

    const topicMetadata = metadata.topicMetadata.find((t: any) => t.topic === topic)
    return topicMetadata ? topicMetadata.partitionMetadata : []
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
    const partitionMetadata = this.findTopicPartitionMetadata(topic)
    return partitions.reduce((result: any, id: any) => {
      const partitionId = parseInt(id, 10)
      const metadata = partitionMetadata.find((p: any) => p.partitionId === partitionId)

      if (!metadata) {
        return result
      }

      if (metadata.leader === null || metadata.leader === undefined) {
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ topic: any; partitionId: numbe... Remove this comment to see the full error message
        throw new KafkaJSError('Invalid partition metadata', { topic, partitionId, metadata })
      }

      const { leader } = metadata
      const current = result[leader] || []
      return { ...result, [leader]: [...current, partitionId] }
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
    coordinatorType = COORDINATOR_TYPES.GROUP
  }: any) {
    return this.retrier(async (bail: any, retryCount: any, retryTime: any) => {
      try {
        const { coordinator } = await this.findGroupCoordinatorMetadata({
          groupId,
          coordinatorType,
        })
        return await this.findBroker({ nodeId: coordinator.nodeId })
      } catch (e) {
        // A new broker can join the cluster before we have the chance
        // to refresh metadata
        if (e.name === 'KafkaJSBrokerNotFound' || e.type === 'GROUP_COORDINATOR_NOT_AVAILABLE') {
          this.logger.debug(`${e.message}, refreshing metadata and trying again...`, {
            groupId,
            retryCount,
            retryTime,
          })

          await this.refreshMetadata()
          throw e
        }

        if (e.code === 'ECONNREFUSED') {
          // During maintenance the current coordinator can go down; findBroker will
          // refresh metadata and re-throw the error. findGroupCoordinator has to re-throw
          // the error to go through the retry cycle.
          throw e
        }

        bail(e)
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
  async findGroupCoordinatorMetadata({
    groupId,
    coordinatorType
  }: any) {
    const brokerMetadata = await this.brokerPool.withBroker(async ({
      nodeId,
      broker
    }: any) => {
      return await this.retrier(async (bail: any, retryCount: any, retryTime: any) => {
        try {
          const brokerMetadata = await broker.findGroupCoordinator({ groupId, coordinatorType })
          this.logger.debug('Found group coordinator', {
            broker: brokerMetadata.host,
            nodeId: brokerMetadata.coordinator.nodeId,
          })
          return brokerMetadata
        } catch (e) {
          this.logger.debug('Tried to find group coordinator', {
            nodeId,
            error: e,
          })

          if (e.type === 'GROUP_COORDINATOR_NOT_AVAILABLE') {
            this.logger.debug('Group coordinator not available, retrying...', {
              nodeId,
              retryCount,
              retryTime,
            })

            throw e
          }

          bail(e)
        }
      });
    })

    if (brokerMetadata) {
      return brokerMetadata
    }

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    throw new KafkaJSGroupCoordinatorNotFound('Failed to find group coordinator')
  }

  /**
   * @param {object} topicConfiguration
   * @returns {number}
   */
  defaultOffset({
    fromBeginning
  }: any) {
    return fromBeginning ? EARLIEST_OFFSET : LATEST_OFFSET
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
    const partitionsPerBroker = {}
    const topicConfigurations = {}

    const addDefaultOffset = (topic: any) => (partition: any) => {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      const { timestamp } = topicConfigurations[topic]
      return { ...partition, timestamp }
    }

    // Index all topics and partitions per leader (nodeId)
    for (const topicData of topics) {
      const { topic, partitions, fromBeginning, fromTimestamp } = topicData
      const partitionsPerLeader = this.findLeaderForPartitions(
        topic,
        partitions.map((p: any) => p.partition)
      )
      const timestamp =
        fromTimestamp != null ? fromTimestamp : this.defaultOffset({ fromBeginning })

      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      topicConfigurations[topic] = { timestamp }

      keys(partitionsPerLeader).forEach(nodeId => {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        partitionsPerBroker[nodeId] = partitionsPerBroker[nodeId] || {}
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        partitionsPerBroker[nodeId][topic] = partitions.filter((p: any) => partitionsPerLeader[nodeId].includes(p.partition)
        )
      })
    }

    // Create a list of requests to fetch the offset of all partitions
    const requests = keys(partitionsPerBroker).map(async nodeId => {
      const broker = await this.findBroker({ nodeId })
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      const partitions = partitionsPerBroker[nodeId]

      const { responses: topicOffsets } = await broker.listOffsets({
        isolationLevel: this.isolationLevel,
        topics: keys(partitions).map(topic => ({
          topic,
          partitions: partitions[topic].map(addDefaultOffset(topic)),
        })),
      })

      return topicOffsets
    })

    // Execute all requests, merge and normalize the responses
    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    const responses = await Promise.all(requests)
    const partitionsPerTopic = flatten(responses).reduce(mergeTopics, {})

    return keys(partitionsPerTopic).map(topic => ({
      topic,
      partitions: partitionsPerTopic[topic].map(({
        partition,
        offset
      }: any) => ({
        partition,
        offset,
      })),
    }));
  }

  /**
   * Retrieve the object mapping for committed offsets for a single consumer group
   * @param {object} options
   * @param {string} options.groupId
   * @returns {Object}
   */
  committedOffsets({
    groupId
  }: any) {
    if (!this.committedOffsetsByGroup.has(groupId)) {
      this.committedOffsetsByGroup.set(groupId, {})
    }

    return this.committedOffsetsByGroup.get(groupId)
  }

  /**
   * Mark offset as committed for a single consumer group's topic-partition
   * @param {object} options
   * @param {string} options.groupId
   * @param {string} options.topic
   * @param {string|number} options.partition
   * @param {string} options.offset
   */
  markOffsetAsCommitted({
    groupId,
    topic,
    partition,
    offset
  }: any) {
    const committedOffsets = this.committedOffsets({ groupId })

    committedOffsets[topic] = committedOffsets[topic] || {}
    committedOffsets[topic][partition] = offset
  }
}
