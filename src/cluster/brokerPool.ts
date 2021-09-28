// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Broker'.
const Broker = require('../broker')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createRetr... Remove this comment to see the full error message
const createRetry = require('../retry')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'shuffle'.
const shuffle = require('../utils/shuffle')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'arrayDiff'... Remove this comment to see the full error message
const arrayDiff = require('../utils/arrayDiff')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSBro... Remove this comment to see the full error message
const { KafkaJSBrokerNotFound, KafkaJSProtocolError } = require('../errors')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'keys'.
const { keys, assign, values } = Object
const hasBrokerBeenReplaced = (broker: any, {
  host,
  port,
  rack
}: any) =>
  broker.connection.host !== host ||
  broker.connection.port !== port ||
  broker.connection.rack !== rack

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class BrokerPool {
  brokers: any;
  connectionBuilder: any;
  createBroker: any;
  logger: any;
  metadata: any;
  metadataExpireAt: any;
  metadataMaxAge: any;
  retrier: any;
  rootLogger: any;
  seedBroker: any;
  supportAuthenticationProtocol: any;
  versions: any;
  /**
   * @param {object} options
   * @param {import("./connectionBuilder").ConnectionBuilder} options.connectionBuilder
   * @param {import("../../types").Logger} options.logger
   * @param {import("../../types").RetryOptions} [options.retry]
   * @param {boolean} [options.allowAutoTopicCreation]
   * @param {number} [options.authenticationTimeout]
   * @param {number} [options.reauthenticationThreshold]
   * @param {number} [options.metadataMaxAge]
   */
  constructor({
    connectionBuilder,
    logger,
    retry,
    allowAutoTopicCreation,
    authenticationTimeout,
    reauthenticationThreshold,
    metadataMaxAge
  }: any) {
    this.rootLogger = logger
    this.connectionBuilder = connectionBuilder
    this.metadataMaxAge = metadataMaxAge || 0
    this.logger = logger.namespace('BrokerPool')
    this.retrier = createRetry(assign({}, retry))

    this.createBroker = (options: any) => new Broker({
      allowAutoTopicCreation,
      authenticationTimeout,
      reauthenticationThreshold,
      ...options,
    })

    this.brokers = {}
    /** @type {Broker | undefined} */
    this.seedBroker = undefined
    /** @type {import("../../types").BrokerMetadata | null} */
    this.metadata = null
    this.metadataExpireAt = null
    this.versions = null
    this.supportAuthenticationProtocol = null
  }

  /**
   * @public
   * @returns {Boolean}
   */
  hasConnectedBrokers() {
    const brokers = values(this.brokers)
    return !!brokers.find((broker: any) => broker.isConnected()) ||
    (this.seedBroker ? this.seedBroker.isConnected() : false);
  }

  // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
  async createSeedBroker() {
    if (this.seedBroker) {
      await this.seedBroker.disconnect()
    }

    this.seedBroker = this.createBroker({
      connection: await this.connectionBuilder.build(),
      logger: this.rootLogger,
    })
  }

  /**
   * @public
   * @returns {Promise<void>}
   */
  async connect() {
    if (this.hasConnectedBrokers()) {
      return
    }

    if (!this.seedBroker) {
      await this.createSeedBroker()
    }

    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    return this.retrier(async (bail: any, retryCount: any, retryTime: any) => {
      try {
        await this.seedBroker.connect()
        this.versions = this.seedBroker.versions
      } catch (e) {
        if (e.name === 'KafkaJSConnectionError' || e.type === 'ILLEGAL_SASL_STATE') {
          // Connection builder will always rotate the seed broker
          await this.createSeedBroker()
          this.logger.error(
            `Failed to connect to seed broker, trying another broker from the list: ${e.message}`,
            { retryCount, retryTime }
          )
        } else {
          this.logger.error(e.message, { retryCount, retryTime })
        }

        if (e.retriable) throw e
        bail(e)
      }
    });
  }

  /**
   * @public
   * @returns {Promise}
   */
  async disconnect() {
    this.seedBroker && (await this.seedBroker.disconnect())
    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all(values(this.brokers).map((broker: any) => broker.disconnect()))

    this.brokers = {}
    this.metadata = null
    this.versions = null
    this.supportAuthenticationProtocol = null
  }

  /**
   * @public
   * @param {Object} destination
   * @param {string} destination.host
   * @param {number} destination.port
   */
  removeBroker({
    host,
    port
  }: any) {
    const removedBroker = values(this.brokers).find(
      (broker: any) => broker.connection.host === host && broker.connection.port === port
    )

    if (removedBroker) {
      delete this.brokers[removedBroker.nodeId]
      this.metadataExpireAt = null

      if (this.seedBroker.nodeId === removedBroker.nodeId) {
        this.seedBroker = shuffle(values(this.brokers))[0]
      }
    }
  }

  /**
   * @public
   * @param {Array<String>} topics
   * @returns {Promise<null>}
   */
  async refreshMetadata(topics: any) {
    const broker = await this.findConnectedBroker()
    const { host: seedHost, port: seedPort } = this.seedBroker.connection

    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    return this.retrier(async (bail: any, retryCount: any, retryTime: any) => {
      try {
        this.metadata = await broker.metadata(topics)
        this.metadataExpireAt = Date.now() + this.metadataMaxAge

        const replacedBrokers: any = []

        this.brokers = await this.metadata.brokers.reduce(
          async (resultPromise: any, {
            nodeId,
            host,
            port,
            rack
          }: any) => {
            const result = await resultPromise

            if (result[nodeId]) {
              if (!hasBrokerBeenReplaced(result[nodeId], { host, port, rack })) {
                return result
              }

              replacedBrokers.push(result[nodeId])
            }

            if (host === seedHost && port === seedPort) {
              this.seedBroker.nodeId = nodeId
              this.seedBroker.connection.rack = rack
              return assign(result, {
                [nodeId]: this.seedBroker,
              })
            }

            return assign(result, {
              [nodeId]: this.createBroker({
                logger: this.rootLogger,
                versions: this.versions,
                supportAuthenticationProtocol: this.supportAuthenticationProtocol,
                connection: await this.connectionBuilder.build({ host, port, rack }),
                nodeId,
              }),
            })
          },
          this.brokers
        )

        const freshBrokerIds = this.metadata.brokers.map(({
          nodeId
        }: any) => `${nodeId}`).sort()
        const currentBrokerIds = keys(this.brokers).sort()
        const unusedBrokerIds = arrayDiff(currentBrokerIds, freshBrokerIds)

        const brokerDisconnects = unusedBrokerIds.map((nodeId: any) => {
          const broker = this.brokers[nodeId]
          return broker.disconnect().then(() => {
            delete this.brokers[nodeId]
          })
        })

        // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'broker' implicitly has an 'any' type.
        const replacedBrokersDisconnects = replacedBrokers.map(broker => broker.disconnect())
        // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
        await Promise.all([...brokerDisconnects, ...replacedBrokersDisconnects])
      } catch (e) {
        if (e.type === 'LEADER_NOT_AVAILABLE') {
          throw e
        }

        bail(e)
      }
    });
  }

  /**
   * Only refreshes metadata if the data is stale according to the `metadataMaxAge` param or does not contain information about the provided topics
   *
   * @public
   * @param {Array<String>} topics
   * @returns {Promise<null>}
   */
  async refreshMetadataIfNecessary(topics: any) {
    const shouldRefresh =
      this.metadata == null ||
      this.metadataExpireAt == null ||
      Date.now() > this.metadataExpireAt ||
      !topics.every((topic: any) => this.metadata.topicMetadata.some((topicMetadata: any) => topicMetadata.topic === topic)
      )

    if (shouldRefresh) {
      return this.refreshMetadata(topics)
    }
  }

  /**
   * @public
   * @param {object} options
   * @param {string} options.nodeId
   * @returns {Promise<Broker>}
   */
  async findBroker({
    nodeId
  }: any) {
    const broker = this.brokers[nodeId]

    if (!broker) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
      throw new KafkaJSBrokerNotFound(`Broker ${nodeId} not found in the cached metadata`)
    }

    await this.connectBroker(broker)
    return broker
  }

  /**
   * @public
   * @param {(params: { nodeId: string, broker: Broker }) => Promise<T>} callback
   * @returns {Promise<T>}
   * @template T
   */
  async withBroker(callback: any) {
    const brokers = shuffle(keys(this.brokers))
    if (brokers.length === 0) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
      throw new KafkaJSBrokerNotFound('No brokers in the broker pool')
    }

    for (const nodeId of brokers) {
      const broker = await this.findBroker({ nodeId })
      try {
        return await callback({ nodeId, broker })
      } catch (e) {}
    }

    return null
  }

  /**
   * @public
   * @returns {Promise<Broker>}
   */
  async findConnectedBroker() {
    const nodeIds = shuffle(keys(this.brokers))
    const connectedBrokerId = nodeIds.find((nodeId: any) => this.brokers[nodeId].isConnected())

    if (connectedBrokerId) {
      return await this.findBroker({ nodeId: connectedBrokerId })
    }

    // Cycle through the nodes until one connects
    for (const nodeId of nodeIds) {
      try {
        return await this.findBroker({ nodeId })
      } catch (e) {}
    }

    // Failed to connect to all known brokers, metadata might be old
    await this.connect()
    return this.seedBroker
  }

  /**
   * @private
   * @param {Broker} broker
   * @returns {Promise<null>}
   */
  async connectBroker(broker: any) {
    if (broker.isConnected()) {
      return
    }

    return this.retrier(async (bail: any, retryCount: any, retryTime: any) => {
      try {
        await broker.connect()
      } catch (e) {
        if (e.name === 'KafkaJSConnectionError' || e.type === 'ILLEGAL_SASL_STATE') {
          await broker.disconnect()
        }

        // To avoid reconnecting to an unavailable host, we bail on connection errors
        // and refresh metadata on a higher level before reconnecting
        if (e.name === 'KafkaJSConnectionError') {
          return bail(e)
        }

        if (e.type === 'ILLEGAL_SASL_STATE') {
          // Rebuild the connection since it can't recover from illegal SASL state
          broker.connection = await this.connectionBuilder.build({
            host: broker.connection.host,
            port: broker.connection.port,
            rack: broker.connection.rack,
          })

          this.logger.error(`Failed to connect to broker, reconnecting`, { retryCount, retryTime })
          throw new KafkaJSProtocolError(e, { retriable: true })
        }

        if (e.retriable) throw e
        this.logger.error(e, { retryCount, retryTime, stack: e.stack })
        bail(e)
      }
    });
  }
}
