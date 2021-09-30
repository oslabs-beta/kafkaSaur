// @ts-expect-error ts-migrate(6200) FIXME: Definitions of the following identifiers conflict ... Remove this comment to see the full error message
const createRetry = require('../retry')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CONNECTION... Remove this comment to see the full error message
const { CONNECTION_STATUS } = require('../network/connectionStatus')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DefaultPar... Remove this comment to see the full error message
const { DefaultPartitioner } = require('./partitioners/')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Instrument... Remove this comment to see the full error message
const InstrumentationEventEmitter = require('../instrumentation/emitter')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createEosM... Remove this comment to see the full error message
const createEosManager = require('./eosManager')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createMessageProducer = require('./messageProducer')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { events, wrap: wrapEvent, unwrap: unwrapEvent } = require('./instrumentationEvents')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSNon... Remove this comment to see the full error message
const { KafkaJSNonRetriableError } = require('../errors')

// @ts-expect-error ts-migrate(2339) FIXME: Property 'values' does not exist on type 'ObjectCo... Remove this comment to see the full error message
const { values, keys } = Object
const eventNames = values(events)
const eventKeys = keys(events)
  .map(key => `producer.events.${key}`)
  .join(', ')

const { CONNECT, DISCONNECT } = events

/**
 *
 * @param {Object} params
 * @param {import('../../types').Cluster} params.cluster
 * @param {import('../../types').Logger} params.logger
 * @param {import('../../types').ICustomPartitioner} [params.createPartitioner]
 * @param {import('../../types').RetryOptions} [params.retry]
 * @param {boolean} [params.idempotent]
 * @param {string} [params.transactionalId]
 * @param {number} [params.transactionTimeout]
 * @param {InstrumentationEventEmitter} [params.instrumentationEmitter]
 *
 * @returns {import('../../types').Producer}
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  cluster,
  logger: rootLogger,
  createPartitioner = DefaultPartitioner,
  retry,
  idempotent = false,
  transactionalId,
  transactionTimeout,
  instrumentationEmitter: rootInstrumentationEmitter
}: any) => {
  let connectionStatus = CONNECTION_STATUS.DISCONNECTED
  retry = retry || { retries: idempotent ? (Number as any).MAX_SAFE_INTEGER : 5 };

  if (idempotent && retry.retries < 1) {
    throw new KafkaJSNonRetriableError(
      'Idempotent producer must allow retries to protect against transient errors'
    )
  }

  const logger = rootLogger.namespace('Producer')

  if (idempotent && retry.retries < (Number as any).MAX_SAFE_INTEGER) {
    logger.warn('Limiting retries for the idempotent producer may invalidate EoS guarantees')
  }

  const partitioner = createPartitioner()
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  const retrier = createRetry(Object.assign({}, cluster.retry, retry))
  const instrumentationEmitter = rootInstrumentationEmitter || new InstrumentationEventEmitter()
  const idempotentEosManager = createEosManager({
    logger,
    cluster,
    transactionTimeout,
    transactional: false,
    transactionalId,
  })

  const { send, sendBatch } = createMessageProducer({
    logger,
    cluster,
    partitioner,
    eosManager: idempotentEosManager,
    idempotent,
    retrier,
    getConnectionStatus: () => connectionStatus,
  })

  let transactionalEosManager: any

  /**
   * @param {string} eventName
   * @param {AsyncFunction} listener
   * @return {Function} removeListener
   */
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
   * Begin a transaction. The returned object contains methods to send messages
   * to the transaction and end the transaction by committing or aborting.
   *
   * Only messages sent on the transaction object will participate in the transaction.
   *
   * Calling any of the transactional methods after the transaction has ended
   * will raise an exception (use `isActive` to ascertain if ended).
   * @returns {Promise<Transaction>}
   *
   * @typedef {Object} Transaction
   * @property {Function} send  Identical to the producer "send" method
   * @property {Function} sendBatch Identical to the producer "sendBatch" method
   * @property {Function} abort Abort the transaction
   * @property {Function} commit  Commit the transaction
   * @property {Function} isActive  Whether the transaction is active
   */
  const transaction = async () => {
    if (!transactionalId) {
      throw new KafkaJSNonRetriableError('Must provide transactional id for transactional producer')
    }

    let transactionDidEnd = false
    transactionalEosManager =
      transactionalEosManager ||
      createEosManager({
        logger,
        cluster,
        transactionTimeout,
        transactional: true,
        transactionalId,
      })

    if (transactionalEosManager.isInTransaction()) {
      throw new KafkaJSNonRetriableError(
        'There is already an ongoing transaction for this producer. Please end the transaction before beginning another.'
      )
    }

    // We only initialize the producer id once
    if (!transactionalEosManager.isInitialized()) {
      await transactionalEosManager.initProducerId()
    }
    transactionalEosManager.beginTransaction()

    const { send: sendTxn, sendBatch: sendBatchTxn } = createMessageProducer({
      logger,
      cluster,
      partitioner,
      retrier,
      eosManager: transactionalEosManager,
      idempotent: true,
      getConnectionStatus: () => connectionStatus,
    })

    const isActive = () => transactionalEosManager.isInTransaction() && !transactionDidEnd

    const transactionGuard = (fn: any) => (...args: any[]) => {
      if (!isActive()) {
        // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
        return Promise.reject(
          new KafkaJSNonRetriableError('Cannot continue to use transaction once ended')
        )
      }

      return fn(...args)
    }

    return {
      sendBatch: transactionGuard(sendBatchTxn),
      send: transactionGuard(sendTxn),
      /**
       * Abort the ongoing transaction.
       *
       * @throws {KafkaJSNonRetriableError} If transaction has ended
       */
      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      abort: transactionGuard(async () => {
        await transactionalEosManager.abort()
        transactionDidEnd = true
      }),
      /**
       * Commit the ongoing transaction.
       *
       * @throws {KafkaJSNonRetriableError} If transaction has ended
       */
      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      commit: transactionGuard(async () => {
        await transactionalEosManager.commit()
        transactionDidEnd = true
      }),
      /**
       * Sends a list of specified offsets to the consumer group coordinator, and also marks those offsets as part of the current transaction.
       *
       * @throws {KafkaJSNonRetriableError} If transaction has ended
       */
      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      sendOffsets: transactionGuard(async ({
        consumerGroupId,
        topics
      }: any) => {
        await transactionalEosManager.sendOffsets({ consumerGroupId, topics })

        for (const topicOffsets of topics) {
          const { topic, partitions } = topicOffsets
          for (const { partition, offset } of partitions) {
            cluster.markOffsetAsCommitted({
              groupId: consumerGroupId,
              topic,
              partition,
              offset,
            })
          }
        }
      }),
      isActive,
    };
  }

  /**
   * @returns {Object} logger
   */
  const getLogger = () => logger

  return {
    /**
     * @returns {Promise}
     */
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    connect: async () => {
      await cluster.connect()
      connectionStatus = CONNECTION_STATUS.CONNECTED
      instrumentationEmitter.emit(CONNECT)

      if (idempotent && !idempotentEosManager.isInitialized()) {
        await idempotentEosManager.initProducerId()
      }
    },
    /**
     * @return {Promise}
     */
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    disconnect: async () => {
      connectionStatus = CONNECTION_STATUS.DISCONNECTING
      await cluster.disconnect()
      connectionStatus = CONNECTION_STATUS.DISCONNECTED
      instrumentationEmitter.emit(DISCONNECT)
    },
    isIdempotent: () => {
      return idempotent
    },
    events,
    on,
    send,
    sendBatch,
    transaction,
    logger: getLogger,
  }
}
