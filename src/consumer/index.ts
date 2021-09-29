import Long from '../utils/long.ts'
import createRetry from '../retry'
import { initialRetryTime } from '../retry/defaults.ts'
import { ConsumerGroup } from './consumerGroup.ts'
import Runner from './runner.ts'
import { events, wrap as wrapEvent, unwrap as unwrapEvent } from './instrumentationEvents.ts'
import InstrumentationEventEmitter from '../instrumentation/emitter.ts'
import { KafkaJSNonRetriableError } from '../errors.ts'
import { roundRobin } from './assigners'
import  Constants from '../constants.ts'
import ISOLATION_LEVEL from '../protocol/isolationLevel.ts'

const { EARLIEST_OFFSET, LATEST_OFFSET } = Constants

const { keys, values } = Object
const { CONNECT, DISCONNECT, STOP, CRASH } = events

const eventNames = values(events)
const eventKeys = keys(events)
  .map(key => `consumer.events.${key}`)
  .join(', ')

const specialOffsets = [
  Long.fromValue(EARLIEST_OFFSET).toString(),
  Long.fromValue(LATEST_OFFSET).toString(),
]

/**
 * @param {Object} params
 * @param {import("../../types").Cluster} params.cluster
 * @param {String} params.groupId
 * @param {import('../../types').RetryOptions} [params.retry]
 * @param {import('../../types').Logger} params.logger
 * @param {import('../../types').PartitionAssigner[]} [params.partitionAssigners]
 * @param {number} [params.sessionTimeout]
 * @param {number} [params.rebalanceTimeout]
 * @param {number} [params.heartbeatInterval]
 * @param {number} [params.maxBytesPerPartition]
 * @param {number} [params.minBytes]
 * @param {number} [params.maxBytes]
 * @param {number} [params.maxWaitTimeInMs]
 * @param {number} [params.isolationLevel]
 * @param {string} [params.rackId]
 * @param {InstrumentationEventEmitter} [params.instrumentationEmitter]
 * @param {number} params.metadataMaxAge
 *
 * @returns {import("../../types").Consumer}
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
  cluster,
  groupId,
  retry,
  logger: rootLogger,
  partitionAssigners = [roundRobin],
  sessionTimeout = 30000,
  rebalanceTimeout = 60000,
  heartbeatInterval = 3000,

  // 1MB
  maxBytesPerPartition = 1048576,

  minBytes = 1,

  // 10MB
  maxBytes = 10485760,

  maxWaitTimeInMs = 5000,
  isolationLevel = ISOLATION_LEVEL.READ_COMMITTED,
  rackId = '',
  instrumentationEmitter: rootInstrumentationEmitter,
  metadataMaxAge
}: any) => {
  if (!groupId) {
    throw new KafkaJSNonRetriableError('Consumer groupId must be a non-empty string.')
  }

  const logger = rootLogger.namespace('Consumer')
  const instrumentationEmitter = rootInstrumentationEmitter || new InstrumentationEventEmitter()
  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'createAssigner' implicitly has an 'any'... Remove this comment to see the full error message
  const assigners = partitionAssigners.map(createAssigner =>
    createAssigner({ groupId, logger, cluster })
  )

  const topics = {}
  let runner: any = null
  let consumerGroup: any = null

  if (heartbeatInterval >= sessionTimeout) {
    throw new KafkaJSNonRetriableError(
      `Consumer heartbeatInterval (${heartbeatInterval}) must be lower than sessionTimeout (${sessionTimeout}). It is recommended to set heartbeatInterval to approximately a third of the sessionTimeout.`
    )
  }

  const createConsumerGroup = ({
    autoCommit,
    autoCommitInterval,
    autoCommitThreshold
  }: any) => {
    return new ConsumerGroup({
      logger: rootLogger,
      topics: keys(topics),
      topicConfigurations: topics,
      retry,
      cluster,
      groupId,
      assigners,
      sessionTimeout,
      rebalanceTimeout,
      maxBytesPerPartition,
      minBytes,
      maxBytes,
      maxWaitTimeInMs,
      instrumentationEmitter,
      autoCommit,
      autoCommitInterval,
      autoCommitThreshold,
      isolationLevel,
      rackId,
      metadataMaxAge,
    })
  }

  const createRunner = ({
    eachBatchAutoResolve,
    eachBatch,
    eachMessage,
    onCrash,
    autoCommit,
    partitionsConsumedConcurrently
  }: any) => {
    return new Runner({
      autoCommit,
      logger: rootLogger,
      consumerGroup,
      instrumentationEmitter,
      eachBatchAutoResolve,
      eachBatch,
      eachMessage,
      heartbeatInterval,
      retry,
      onCrash,
      partitionsConsumedConcurrently,
    })
  }

  /** @type {import("../../types").Consumer["connect"]} */
  // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
  const connect = async () => {
    await cluster.connect()
    instrumentationEmitter.emit(CONNECT)
  }

  /** @type {import("../../types").Consumer["disconnect"]} */
  // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
  const disconnect = async () => {
    try {
      await stop()
      logger.debug('consumer has stopped, disconnecting', { groupId })
      await cluster.disconnect()
      instrumentationEmitter.emit(DISCONNECT)
    } catch (e) {}
  }

  /** @type {import("../../types").Consumer["stop"]} */
  // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
  const stop = async () => {
    try {
      if (runner) {
        await runner.stop()
        runner = null
        consumerGroup = null
        instrumentationEmitter.emit(STOP)
      }

      logger.info('Stopped', { groupId })
    } catch (e) {}
  }

  /** @type {import("../../types").Consumer["subscribe"]} */
  // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
  const subscribe = async ({
    topic,
    fromBeginning = false
  }: any) => {
    if (consumerGroup) {
      throw new KafkaJSNonRetriableError('Cannot subscribe to topic while consumer is running')
    }

    if (!topic) {
      throw new KafkaJSNonRetriableError(`Invalid topic ${topic}`)
    }

    const isRegExp = topic instanceof RegExp
    if (typeof topic !== 'string' && !isRegExp) {
      throw new KafkaJSNonRetriableError(
        `Invalid topic ${topic} (${typeof topic}), the topic name has to be a String or a RegExp`
      )
    }

    const topicsToSubscribe = []
    if (isRegExp) {
      const topicRegExp = topic
      const metadata = await cluster.metadata()
      const matchedTopics = metadata.topicMetadata
        // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'topicName' implicitly has an 'any... Remove this comment to see the full error message
        .map(({ topic: topicName }) => topicName)
        .filter((topicName: any) => topicRegExp.test(topicName))

      logger.debug('Subscription based on RegExp', {
        groupId,
        topicRegExp: topicRegExp.toString(),
        matchedTopics,
      })

      topicsToSubscribe.push(...matchedTopics)
    } else {
      topicsToSubscribe.push(topic)
    }

    for (const t of topicsToSubscribe) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      topics[t] = { fromBeginning }
    }

    await cluster.addMultipleTargetTopics(topicsToSubscribe)
  }

  /** @type {import("../../types").Consumer["run"]} */
  // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
  const run = async ({
    autoCommit = true,
    autoCommitInterval = null,
    autoCommitThreshold = null,
    eachBatchAutoResolve = true,
    partitionsConsumedConcurrently = 1,
    eachBatch = null,
    eachMessage = null,
  } = {}) => {
    if (consumerGroup) {
      logger.warn('consumer#run was called, but the consumer is already running', { groupId })
      return
    }

    consumerGroup = createConsumerGroup({
      autoCommit,
      autoCommitInterval,
      autoCommitThreshold,
    })

    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    const start = async (onCrash: any) => {
      logger.info('Starting', { groupId })
      runner = createRunner({
        autoCommit,
        eachBatchAutoResolve,
        eachBatch,
        eachMessage,
        onCrash,
        partitionsConsumedConcurrently,
      })

      await runner.start()
    }

    const restart = (onCrash: any) => {
      consumerGroup = createConsumerGroup({
        autoCommitInterval,
        autoCommitThreshold,
      })

      start(onCrash)
    }

    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    const onCrash = async (e: any) => {
      logger.error(`Crash: ${e.name}: ${e.message}`, {
        groupId,
        retryCount: e.retryCount,
        stack: e.stack,
      })

      if (e.name === 'KafkaJSConnectionClosedError') {
        cluster.removeBroker({ host: e.host, port: e.port })
      }

      await disconnect()

      const isErrorRetriable = e.name === 'KafkaJSNumberOfRetriesExceeded' || e.retriable === true
      const shouldRestart =
        isErrorRetriable &&
        (!retry ||
          !retry.restartOnFailure ||
          (await retry.restartOnFailure(e).catch((error: any) => {
            logger.error(
              'Caught error when invoking user-provided "restartOnFailure" callback. Defaulting to restarting.',
              {
                error: error.message || error,
                originalError: e.message || e,
                groupId,
              }
            )

            return true
          })))

      instrumentationEmitter.emit(CRASH, {
        error: e,
        groupId,
        restart: shouldRestart,
      })

      if (shouldRestart) {
        const retryTime = e.retryTime || (retry && retry.initialRetryTime) || initialRetryTime
        logger.error(`Restarting the consumer in ${retryTime}ms`, {
          retryCount: e.retryCount,
          retryTime,
          groupId,
        })

        setTimeout(() => restart(onCrash), retryTime)
      }
    }

    await start(onCrash)
  }

  /** @type {import("../../types").Consumer["on"]} */
  const on = (eventName: any, listener: any) => {
    if (!eventNames.includes(eventName)) {
      throw new KafkaJSNonRetriableError(`Event name should be one of ${eventKeys}`)
    }

    return instrumentationEmitter.addListener(unwrapEvent(eventName), (event: any) => {
      event.type = wrapEvent(event.type)
      // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
      Promise.resolve(listener(event)).catch((e: any) => {
        logger.error(`Failed to execute listener: ${e.message}`, {
          eventName,
          stack: e.stack,
        })
      })
    });
  }

  /**
   * @type {import("../../types").Consumer["commitOffsets"]}
   * @param topicPartitions
   *   Example: [{ topic: 'topic-name', partition: 0, offset: '1', metadata: 'event-id-3' }]
   */
  const commitOffsets = async (topicPartitions = []) => {
    const commitsByTopic = topicPartitions.reduce(
      (payload, { topic, partition, offset, metadata = null }) => {
        if (!topic) {
          throw new KafkaJSNonRetriableError(`Invalid topic ${topic}`)
        }

        if (isNaN(partition)) {
          throw new KafkaJSNonRetriableError(
            `Invalid partition, expected a number received ${partition}`
          )
        }

        let commitOffset
        try {
          commitOffset = Long.fromValue(offset)
        } catch (_) {
          throw new KafkaJSNonRetriableError(`Invalid offset, expected a long received ${offset}`)
        }

        if (commitOffset.lessThan(0)) {
          throw new KafkaJSNonRetriableError('Offset must not be a negative number')
        }

        if (metadata !== null && typeof metadata !== 'string') {
          throw new KafkaJSNonRetriableError(
            `Invalid offset metadata, expected string or null, received ${metadata}`
          )
        }

        // @ts-expect-error ts-migrate(7022) FIXME: 'topicCommits' implicitly has type 'any' because i... Remove this comment to see the full error message
        const topicCommits = payload[topic] || []

        // @ts-expect-error ts-migrate(2448) FIXME: Block-scoped variable 'topicCommits' used before i... Remove this comment to see the full error message
        (topicCommits as any).push({ partition, offset: commitOffset, metadata });

        return { ...payload, [topic]: topicCommits }
      },
      {}
    )

    if (!consumerGroup) {
      throw new KafkaJSNonRetriableError(
        'Consumer group was not initialized, consumer#run must be called first'
      )
    }

    const topics = Object.keys(commitsByTopic)

    return runner.commitOffsets({
      topics: topics.map(topic => {
        return {
          topic,
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          partitions: commitsByTopic[topic],
        }
      }),
    })
  }

  /** @type {import("../../types").Consumer["seek"]} */
  const seek = ({
    topic,
    partition,
    offset
  }: any) => {
    if (!topic) {
      throw new KafkaJSNonRetriableError(`Invalid topic ${topic}`)
    }

    if (isNaN(partition)) {
      throw new KafkaJSNonRetriableError(
        `Invalid partition, expected a number received ${partition}`
      )
    }

    let seekOffset
    try {
      seekOffset = Long.fromValue(offset)
    } catch (_) {
      throw new KafkaJSNonRetriableError(`Invalid offset, expected a long received ${offset}`)
    }

    // @ts-expect-error ts-migrate(2550) FIXME: Property 'includes' does not exist on type 'any[]'... Remove this comment to see the full error message
    if (seekOffset.lessThan(0) && !specialOffsets.includes(seekOffset.toString())) {
      throw new KafkaJSNonRetriableError('Offset must not be a negative number')
    }

    if (!consumerGroup) {
      throw new KafkaJSNonRetriableError(
        'Consumer group was not initialized, consumer#run must be called first'
      )
    }

    consumerGroup.seek({ topic, partition, offset: seekOffset.toString() })
  }

  /** @type {import("../../types").Consumer["describeGroup"]} */
  const describeGroup = async () => {
    const coordinator = await cluster.findGroupCoordinator({ groupId })
    const retrier = createRetry(retry)
    return retrier(async () => {
      const { groups } = await coordinator.describeGroups({ groupIds: [groupId] })
      return groups.find((group: any) => group.groupId === groupId);
    });
  }

  /**
   * @type {import("../../types").Consumer["pause"]}
   * @param topicPartitions
   *   Example: [{ topic: 'topic-name', partitions: [1, 2] }]
   */
  const pause = (topicPartitions = []) => {
    for (const topicPartition of topicPartitions) {
      if (!topicPartition || !(topicPartition as any).topic) {
        throw new KafkaJSNonRetriableError(`Invalid topic ${(topicPartition && (topicPartition as any).topic) || topicPartition}`);
      } else if (
        typeof (topicPartition as any).partitions !== 'undefined' &&
    (!Array.isArray((topicPartition as any).partitions) || (topicPartition as any).partitions.some(isNaN))
      ) {
        throw new KafkaJSNonRetriableError(`Array of valid partitions required to pause specific partitions instead of ${(topicPartition as any).partitions}`);
      }
    }

    if (!consumerGroup) {
      throw new KafkaJSNonRetriableError(
        'Consumer group was not initialized, consumer#run must be called first'
      )
    }

    consumerGroup.pause(topicPartitions)
  }

  /**
   * Returns the list of topic partitions paused on this consumer
   *
   * @type {import("../../types").Consumer["paused"]}
   */
  const paused = () => {
    if (!consumerGroup) {
      return []
    }

    return consumerGroup.paused()
  }

  /**
   * @type {import("../../types").Consumer["resume"]}
   * @param topicPartitions
   *  Example: [{ topic: 'topic-name', partitions: [1, 2] }]
   */
  const resume = (topicPartitions = []) => {
    for (const topicPartition of topicPartitions) {
      if (!topicPartition || !(topicPartition as any).topic) {
        throw new KafkaJSNonRetriableError(`Invalid topic ${(topicPartition && (topicPartition as any).topic) || topicPartition}`);
      } else if (
        typeof (topicPartition as any).partitions !== 'undefined' &&
    (!Array.isArray((topicPartition as any).partitions) || (topicPartition as any).partitions.some(isNaN))
      ) {
        throw new KafkaJSNonRetriableError(`Array of valid partitions required to resume specific partitions instead of ${(topicPartition as any).partitions}`);
      }
    }

    if (!consumerGroup) {
      throw new KafkaJSNonRetriableError(
        'Consumer group was not initialized, consumer#run must be called first'
      )
    }

    consumerGroup.resume(topicPartitions)
  }

  /**
   * @return {Object} logger
   */
  const getLogger = () => logger

  return {
    connect,
    disconnect,
    subscribe,
    stop,
    run,
    commitOffsets,
    seek,
    describeGroup,
    pause,
    paused,
    resume,
    on,
    events,
    logger: getLogger,
  }
}
