// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createRetr... Remove this comment to see the full error message
const createRetry = require('../../retry')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSNon... Remove this comment to see the full error message
const { KafkaJSNonRetriableError } = require('../../errors')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'COORDINATO... Remove this comment to see the full error message
const COORDINATOR_TYPES = require('../../protocol/coordinatorTypes')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createStateMachine = require('./transactionStateMachine')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const assert = require('assert')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'STATES'.
const STATES = require('./transactionStates')
const NO_PRODUCER_ID = -1
const SEQUENCE_START = 0
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'INT_32_MAX... Remove this comment to see the full error message
const INT_32_MAX_VALUE = Math.pow(2, 32)
const INIT_PRODUCER_RETRIABLE_PROTOCOL_ERRORS = [
  'NOT_COORDINATOR_FOR_GROUP',
  'GROUP_COORDINATOR_NOT_AVAILABLE',
  'GROUP_LOAD_IN_PROGRESS',
  /**
   * The producer might have crashed and never committed the transaction; retry the
   * request so Kafka can abort the current transaction
   * @see https://github.com/apache/kafka/blob/201da0542726472d954080d54bc585b111aaf86f/clients/src/main/java/org/apache/kafka/clients/producer/internals/TransactionManager.java#L1001-L1002
   */
  'CONCURRENT_TRANSACTIONS',
]
const COMMIT_RETRIABLE_PROTOCOL_ERRORS = [
  'UNKNOWN_TOPIC_OR_PARTITION',
  'COORDINATOR_LOAD_IN_PROGRESS',
]
const COMMIT_STALE_COORDINATOR_PROTOCOL_ERRORS = ['COORDINATOR_NOT_AVAILABLE', 'NOT_COORDINATOR']

/**
 * @typedef {Object} EosManager
 */

/**
 * Manage behavior for an idempotent producer and transactions.
 *
 * @returns {EosManager}
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  logger,
  cluster,
  transactionTimeout = 60000,
  transactional,
  transactionalId
}: any) => {
  if (transactional && !transactionalId) {
    throw new KafkaJSNonRetriableError('Cannot manage transactions without a transactionalId')
  }

  const retrier = createRetry(cluster.retry)

  /**
   * Current producer ID
   */
  let producerId = NO_PRODUCER_ID

  /**
   * Current producer epoch
   */
  let producerEpoch = 0

  /**
   * Idempotent production requires that the producer track the sequence number of messages.
   *
   * Sequences are sent with every Record Batch and tracked per Topic-Partition
   */
  let producerSequence = {}

  /**
   * Topic partitions already participating in the transaction
   */
  let transactionTopicPartitions = {}

  const stateMachine = createStateMachine({ logger })
  stateMachine.on('transition', ({
    to
  }: any) => {
    if (to === STATES.READY) {
      transactionTopicPartitions = {}
    }
  })

  const findTransactionCoordinator = () => {
    return cluster.findGroupCoordinator({
      groupId: transactionalId,
      coordinatorType: COORDINATOR_TYPES.TRANSACTION,
    })
  }

  const transactionalGuard = () => {
    if (!transactional) {
      throw new KafkaJSNonRetriableError('Method unavailable if non-transactional')
    }
  }

  const eosManager = stateMachine.createGuarded(
    {
      /**
       * Get the current producer id
       * @returns {number}
       */
      getProducerId() {
        return producerId
      },

      /**
       * Get the current producer epoch
       * @returns {number}
       */
      getProducerEpoch() {
        return producerEpoch
      },

      getTransactionalId() {
        return transactionalId
      },

      /**
       * Initialize the idempotent producer by making an `InitProducerId` request.
       * Overwrites any existing state in this transaction manager
       */
      async initProducerId() {
        // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
        return retrier(async (bail: any, retryCount: any, retryTime: any) => {
          try {
            await cluster.refreshMetadataIfNecessary()

            // If non-transactional we can request the PID from any broker
            const broker = await (transactional
              ? findTransactionCoordinator()
              : cluster.findControllerBroker())

            const result = await broker.initProducerId({
              transactionalId: transactional ? transactionalId : undefined,
              transactionTimeout,
            })

            stateMachine.transitionTo(STATES.READY)
            producerId = result.producerId
            producerEpoch = result.producerEpoch
            producerSequence = {}

            logger.debug('Initialized producer id & epoch', { producerId, producerEpoch })
          } catch (e) {
            // @ts-expect-error ts-migrate(2550) FIXME: Property 'includes' does not exist on type 'string... Remove this comment to see the full error message
            if (INIT_PRODUCER_RETRIABLE_PROTOCOL_ERRORS.includes(e.type)) {
              if (e.type === 'CONCURRENT_TRANSACTIONS') {
                logger.debug('There is an ongoing transaction on this transactionId, retrying', {
                  error: e.message,
                  stack: e.stack,
                  transactionalId,
                  retryCount,
                  retryTime,
                })
              }

              throw e
            }

            bail(e)
          }
        });
      },

      /**
       * Get the current sequence for a given Topic-Partition. Defaults to 0.
       *
       * @param {string} topic
       * @param {string} partition
       * @returns {number}
       */
      getSequence(topic: any, partition: any) {
        if (!eosManager.isInitialized()) {
          return SEQUENCE_START
        }

        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        producerSequence[topic] = producerSequence[topic] || {}
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        producerSequence[topic][partition] = producerSequence[topic][partition] || SEQUENCE_START

        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        return producerSequence[topic][partition]
      },

      /**
       * Update the sequence for a given Topic-Partition.
       *
       * Do nothing if not yet initialized (not idempotent)
       * @param {string} topic
       * @param {string} partition
       * @param {number} increment
       */
      updateSequence(topic: any, partition: any, increment: any) {
        if (!eosManager.isInitialized()) {
          return
        }

        const previous = eosManager.getSequence(topic, partition)
        let sequence = previous + increment

        // Sequence is defined as Int32 in the Record Batch,
        // so theoretically should need to rotate here
        if (sequence >= INT_32_MAX_VALUE) {
          logger.debug(
            `Sequence for ${topic} ${partition} exceeds max value (${sequence}). Rotating to 0.`
          )
          sequence = 0
        }

        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        producerSequence[topic][partition] = sequence
      },

      /**
       * Begin a transaction
       */
      beginTransaction() {
        transactionalGuard()
        stateMachine.transitionTo(STATES.TRANSACTING)
      },

      /**
       * Add partitions to a transaction if they are not already marked as participating.
       *
       * Should be called prior to sending any messages during a transaction
       * @param {TopicData[]} topicData
       *
       * @typedef {Object} TopicData
       * @property {string} topic
       * @property {object[]} partitions
       * @property {number} partitions[].partition
       */
      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      async addPartitionsToTransaction(topicData: any) {
        transactionalGuard()
        const newTopicPartitions = {}

        topicData.forEach(({
          topic,
          partitions
        }: any) => {
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          transactionTopicPartitions[topic] = transactionTopicPartitions[topic] || {}

          partitions.forEach(({
            partition
          }: any) => {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            if (!transactionTopicPartitions[topic][partition]) {
              // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
              newTopicPartitions[topic] = newTopicPartitions[topic] || []
              // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
              newTopicPartitions[topic].push(partition)
            }
          })
        })

        const topics = Object.keys(newTopicPartitions).map(topic => ({
          topic,
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          partitions: newTopicPartitions[topic],
        }))

        if (topics.length) {
          const broker = await findTransactionCoordinator()
          await broker.addPartitionsToTxn({ transactionalId, producerId, producerEpoch, topics })
        }

        topics.forEach(({ topic, partitions }) => {
          partitions.forEach((partition: any) => {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            transactionTopicPartitions[topic][partition] = true
          })
        })
      },

      /**
       * Commit the ongoing transaction
       */
      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      async commit() {
        transactionalGuard()
        stateMachine.transitionTo(STATES.COMMITTING)

        const broker = await findTransactionCoordinator()
        await broker.endTxn({
          producerId,
          producerEpoch,
          transactionalId,
          transactionResult: true,
        })

        stateMachine.transitionTo(STATES.READY)
      },

      /**
       * Abort the ongoing transaction
       */
      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      async abort() {
        transactionalGuard()
        stateMachine.transitionTo(STATES.ABORTING)

        const broker = await findTransactionCoordinator()
        await broker.endTxn({
          producerId,
          producerEpoch,
          transactionalId,
          transactionResult: false,
        })

        stateMachine.transitionTo(STATES.READY)
      },

      /**
       * Whether the producer id has already been initialized
       */
      isInitialized() {
        return producerId !== NO_PRODUCER_ID
      },

      isTransactional() {
        return transactional
      },

      isInTransaction() {
        return stateMachine.state() === STATES.TRANSACTING
      },

      /**
       * Mark the provided offsets as participating in the transaction for the given consumer group.
       *
       * This allows us to commit an offset as consumed only if the transaction passes.
       * @param {string} consumerGroupId The unique group identifier
       * @param {OffsetCommitTopic[]} topics The unique group identifier
       * @returns {Promise}
       *
       * @typedef {Object} OffsetCommitTopic
       * @property {string} topic
       * @property {OffsetCommitTopicPartition[]} partitions
       *
       * @typedef {Object} OffsetCommitTopicPartition
       * @property {number} partition
       * @property {number} offset
       */
      async sendOffsets({
        consumerGroupId,
        topics
      }: any) {
        assert(consumerGroupId, 'Missing consumerGroupId')
        assert(topics, 'Missing offset topics')

        const transactionCoordinator = await findTransactionCoordinator()

        // Do we need to add offsets if we've already done so for this consumer group?
        await transactionCoordinator.addOffsetsToTxn({
          transactionalId,
          producerId,
          producerEpoch,
          groupId: consumerGroupId,
        })

        let groupCoordinator = await cluster.findGroupCoordinator({
          groupId: consumerGroupId,
          coordinatorType: COORDINATOR_TYPES.GROUP,
        })

        // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
        return retrier(async (bail: any, retryCount: any, retryTime: any) => {
          try {
            await groupCoordinator.txnOffsetCommit({
              transactionalId,
              producerId,
              producerEpoch,
              groupId: consumerGroupId,
              topics,
            })
          } catch (e) {
            // @ts-expect-error ts-migrate(2550) FIXME: Property 'includes' does not exist on type 'string... Remove this comment to see the full error message
            if (COMMIT_RETRIABLE_PROTOCOL_ERRORS.includes(e.type)) {
              logger.debug('Group coordinator is not ready yet, retrying', {
                error: e.message,
                stack: e.stack,
                transactionalId,
                retryCount,
                retryTime,
              })

              throw e
            }

            if (
              // @ts-expect-error ts-migrate(2550) FIXME: Property 'includes' does not exist on type 'string... Remove this comment to see the full error message
              COMMIT_STALE_COORDINATOR_PROTOCOL_ERRORS.includes(e.type) ||
              e.code === 'ECONNREFUSED'
            ) {
              logger.debug(
                'Invalid group coordinator, finding new group coordinator and retrying',
                {
                  error: e.message,
                  stack: e.stack,
                  transactionalId,
                  retryCount,
                  retryTime,
                }
              )

              groupCoordinator = await cluster.findGroupCoordinator({
                groupId: consumerGroupId,
                coordinatorType: COORDINATOR_TYPES.GROUP,
              })

              throw e
            }

            bail(e)
          }
        });
      },
    },

    /**
     * Transaction state guards
     */
    {
      initProducerId: { legalStates: [STATES.UNINITIALIZED, STATES.READY] },
      beginTransaction: { legalStates: [STATES.READY], async: false },
      addPartitionsToTransaction: { legalStates: [STATES.TRANSACTING] },
      sendOffsets: { legalStates: [STATES.TRANSACTING] },
      commit: { legalStates: [STATES.TRANSACTING] },
      abort: { legalStates: [STATES.TRANSACTING] },
    }
  )

  return eosManager
}
