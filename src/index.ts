const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createLogg... Remove this comment to see the full error message
  createLogger,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'INFO'.
  LEVELS: { INFO },
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./loggers')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Instrument... Remove this comment to see the full error message
const InstrumentationEventEmitter = require('./instrumentation/emitter')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LoggerCons... Remove this comment to see the full error message
const LoggerConsole = require('./loggers/console')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Cluster'.
const Cluster = require('./cluster')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createProd... Remove this comment to see the full error message
const createProducer = require('./producer')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createCons... Remove this comment to see the full error message
const createConsumer = require('./consumer')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createAdmi... Remove this comment to see the full error message
const createAdmin = require('./admin')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ISOLATION_... Remove this comment to see the full error message
const ISOLATION_LEVEL = require('./protocol/isolationLevel')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'defaultSoc... Remove this comment to see the full error message
const defaultSocketFactory = require('./network/socketFactory')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PRIVATE'.
const PRIVATE = {
  // @ts-expect-error ts-migrate(2585) FIXME: 'Symbol' only refers to a type, but is being used ... Remove this comment to see the full error message
  CREATE_CLUSTER: Symbol('private:Kafka:createCluster'),
  // @ts-expect-error ts-migrate(2585) FIXME: 'Symbol' only refers to a type, but is being used ... Remove this comment to see the full error message
  CLUSTER_RETRY: Symbol('private:Kafka:clusterRetry'),
  // @ts-expect-error ts-migrate(2585) FIXME: 'Symbol' only refers to a type, but is being used ... Remove this comment to see the full error message
  LOGGER: Symbol('private:Kafka:logger'),
  // @ts-expect-error ts-migrate(2585) FIXME: 'Symbol' only refers to a type, but is being used ... Remove this comment to see the full error message
  OFFSETS: Symbol('private:Kafka:offsets'),
}

const DEFAULT_METADATA_MAX_AGE = 300000

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class Client {
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
   * @param {import("../types").RetryOptions} [options.retry]
   * @param {import("../types").ISocketFactory} [options.socketFactory]
   */
  constructor({
    brokers,
    ssl,
    sasl,
    clientId,
    connectionTimeout,
    authenticationTimeout,
    reauthenticationThreshold,
    requestTimeout,
    enforceRequestTimeout = false,
    retry,
    socketFactory = defaultSocketFactory(),
    logLevel = INFO,
    logCreator = LoggerConsole
  }: any) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    this[PRIVATE.OFFSETS] = new Map()
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    this[PRIVATE.LOGGER] = createLogger({ level: logLevel, logCreator })
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    this[PRIVATE.CLUSTER_RETRY] = retry
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    this[PRIVATE.CREATE_CLUSTER] = ({
      metadataMaxAge,
      allowAutoTopicCreation = true,
      maxInFlightRequests = null,
      instrumentationEmitter = null,
      isolationLevel
    }: any) =>
      new Cluster({
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        logger: this[PRIVATE.LOGGER],
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        retry: this[PRIVATE.CLUSTER_RETRY],
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        offsets: this[PRIVATE.OFFSETS],
        socketFactory,
        brokers,
        ssl,
        sasl,
        clientId,
        connectionTimeout,
        authenticationTimeout,
        reauthenticationThreshold,
        requestTimeout,
        enforceRequestTimeout,
        metadataMaxAge,
        instrumentationEmitter,
        allowAutoTopicCreation,
        maxInFlightRequests,
        isolationLevel,
      })
  }

  /**
   * @public
   */
  producer({
    createPartitioner,
    retry,
    metadataMaxAge = DEFAULT_METADATA_MAX_AGE,
    allowAutoTopicCreation,
    idempotent,
    transactionalId,
    transactionTimeout,
    maxInFlightRequests
  }: any = {}) {
    const instrumentationEmitter = new InstrumentationEventEmitter()
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const cluster = this[PRIVATE.CREATE_CLUSTER]({
      metadataMaxAge,
      allowAutoTopicCreation,
      maxInFlightRequests,
      instrumentationEmitter,
    })

    return createProducer({
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      retry: { ...this[PRIVATE.CLUSTER_RETRY], ...retry },
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      logger: this[PRIVATE.LOGGER],
      cluster,
      createPartitioner,
      idempotent,
      transactionalId,
      transactionTimeout,
      instrumentationEmitter,
    })
  }

  /**
   * @public
   */
  consumer({
    groupId,
    partitionAssigners,
    metadataMaxAge = DEFAULT_METADATA_MAX_AGE,
    sessionTimeout,
    rebalanceTimeout,
    heartbeatInterval,
    maxBytesPerPartition,
    minBytes,
    maxBytes,
    maxWaitTimeInMs,
    retry = { retries: 5 },
    allowAutoTopicCreation,
    maxInFlightRequests,
    readUncommitted = false,
    rackId = ''
  }: any = {}) {
    const isolationLevel = readUncommitted
      ? ISOLATION_LEVEL.READ_UNCOMMITTED
      : ISOLATION_LEVEL.READ_COMMITTED

    const instrumentationEmitter = new InstrumentationEventEmitter()
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const cluster = this[PRIVATE.CREATE_CLUSTER]({
      metadataMaxAge,
      allowAutoTopicCreation,
      maxInFlightRequests,
      isolationLevel,
      instrumentationEmitter,
    })

    return createConsumer({
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      retry: { ...this[PRIVATE.CLUSTER_RETRY], ...retry },
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      logger: this[PRIVATE.LOGGER],
      cluster,
      groupId,
      partitionAssigners,
      sessionTimeout,
      rebalanceTimeout,
      heartbeatInterval,
      maxBytesPerPartition,
      minBytes,
      maxBytes,
      maxWaitTimeInMs,
      isolationLevel,
      instrumentationEmitter,
      rackId,
      metadataMaxAge,
    })
  }

  /**
   * @public
   */
  admin({
    retry
  }: any = {}) {
    const instrumentationEmitter = new InstrumentationEventEmitter()
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const cluster = this[PRIVATE.CREATE_CLUSTER]({
      allowAutoTopicCreation: false,
      instrumentationEmitter,
    })

    return createAdmin({
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      retry: { ...this[PRIVATE.CLUSTER_RETRY], ...retry },
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      logger: this[PRIVATE.LOGGER],
      instrumentationEmitter,
      cluster,
    })
  }

  /**
   * @public
   */
  logger() {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    return this[PRIVATE.LOGGER]
  }
}
