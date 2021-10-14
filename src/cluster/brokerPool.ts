//deno-lint-ignore-file no-empty no-explicit-any no-unused-vars
/** @format */

import { Broker } from '../broker/index.ts';
import createRetry from '../retry/index.ts';
import shuffle from '../utils/shuffle.ts';
import arrayDiff from '../utils/arrayDiff.ts';
import { KafkaJSBrokerNotFound, KafkaJSProtocolError } from '../errors.ts';

import { BrokerMetadata, Logger, ApiVersions, BrokerOptions, RetryOptions } from '../../index.d.ts'

const { keys, assign, values } = Object;
const hasBrokerBeenReplaced = (broker: any, { host, port, rack }: any) =>
  broker.connection.host !== host ||
  broker.connection.port !== port ||
  broker.connection.rack !== rack;

export default class BrokerPool {
  brokers: Record<any, any>;
  connectionBuilder: any;
  createBroker: (options: any) => Broker;
  logger: Logger;
  metadata: BrokerMetadata | null;
  metadataExpireAt: number | null;
  metadataMaxAge: number | null;
  retrier: any;
  rootLogger: Logger;
  seedBroker: Broker | undefined;
  supportAuthenticationProtocol: boolean | null;
  versions: ApiVersions | null;
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
    metadataMaxAge,
  }: 
  {
    connectionBuilder: any,
    logger: Logger,
    retry: RetryOptions,
    allowAutoTopicCreation: boolean,
    authenticationTimeout: number,
    reauthenticationThreshold: number,
    metadataMaxAge: number,
  }) {
    this.rootLogger = logger;
    this.connectionBuilder = connectionBuilder;
    this.metadataMaxAge = metadataMaxAge || 0;
    this.logger = logger.namespace('BrokerPool');
    this.retrier = createRetry(assign({}, retry));

    this.createBroker = (options: any) =>
      new Broker({
        allowAutoTopicCreation,
        authenticationTimeout,
        reauthenticationThreshold,
        ...options,
      });

    this.brokers = {};
    /** @type {Broker | undefined} */
    this.seedBroker = undefined;
    /** @type {import("../../types").BrokerMetadata | null} */
    this.metadata = null;
    this.metadataExpireAt = null;
    this.versions = null;
    this.supportAuthenticationProtocol = null;
  }

  /**
   * @public
   * @returns {Boolean}
   */
  hasConnectedBrokers() {
    const brokers = values(this.brokers);
    return (
      !!brokers.find((broker: any) => broker.isConnected()) ||
      (this.seedBroker ? this.seedBroker.isConnected() : false)
    );
  }

  async createSeedBroker() {
    if (this.seedBroker) {
      await this.seedBroker.disconnect();
    }

    this.seedBroker = this.createBroker({
      connection: await this.connectionBuilder.build(),
      logger: this.rootLogger,
    });
  }

  /**
   * @public
   * @returns {Promise<void>}
   */
  async connect() {
    if (this.hasConnectedBrokers()) {
      return;
    }

    if (!this.seedBroker) {
      await this.createSeedBroker();
    }

    return this.retrier(async (bail: any, retryCount: number, retryTime: number) => {
      try {
        //@ts-ignore - if undefined we'll error out
        await this.seedBroker.connect();
        //@ts-ignore - if undefined we'll error out
        this.versions = this.seedBroker.versions;
      } catch (e) {
        if (
          e.name === 'KafkaJSConnectionError' ||
          e.type === 'ILLEGAL_SASL_STATE'
        ) {
          // Connection builder will always rotate the seed broker
          await this.createSeedBroker();
          this.logger.error(
            `Failed to connect to seed broker, trying another broker from the list: ${e.message}`,
            { retryCount, retryTime }
          );
        } else {
          this.logger.error(e.message, { retryCount, retryTime });
        }

        if (e.retriable) throw e;
        bail(e);
      }
    });
  }

  /**
   * @public
   * @returns {Promise}
   */
  async disconnect() {
    this.seedBroker && (await this.seedBroker.disconnect());

    await Promise.all(
      values(this.brokers).map((broker: any) => broker.disconnect())
    );

    this.brokers = {};
    this.metadata = null;
    this.versions = null;
    this.supportAuthenticationProtocol = null;
  }

  /**
   * @public
   * @param {Object} destination
   * @param {string} destination.host
   * @param {number} destination.port
   */
  removeBroker({ host, port }: {host: string, port: number}) {
    const removedBroker: any = values(this.brokers).find(
      (broker: any) =>
        broker.connection.host === host && broker.connection.port === port
    );

    if (removedBroker) {
      delete this.brokers[removedBroker.nodeId];
      this.metadataExpireAt = null;
      //@ts-ignore - undefined ok
      if (this.seedBroker.nodeId === removedBroker.nodeId) {
        this.seedBroker = shuffle(values(this.brokers))[0];
      }
    }
  }

  /**
   * @public
   * @param {Array<String>} topics
   * @returns {Promise<null>}
   */
  async refreshMetadata(topics: string[]) {
    const broker = await this.findConnectedBroker();
    //@ts-ignore - undefined ok, this will only run if seedbroker is defined
    const { host: seedHost, port: seedPort } = this.seedBroker.connection;
    return this.retrier(async (bail: any, retryCount: any, retryTime: any) => {
      try {
        this.metadata = await broker.metadata(topics);
        //@ts-ignore - undefined ok, this will only run if metadataMaxAge is defined
        this.metadataExpireAt = Date.now() + this.metadataMaxAge;

        const replacedBrokers: any[] = [];

        //@ts-ignore - undefined ok
        this.brokers = await this.metadata.brokers.reduce(
          async (resultPromise: any, 
            { nodeId, host, port, rack }: any) => {
            const result = await resultPromise;

            if (result[nodeId]) {
              if (
                !hasBrokerBeenReplaced(result[nodeId], { host, port, rack })
              ) {
                return result;
              }

              replacedBrokers.push(result[nodeId]);
            }

            if (host === seedHost && port === seedPort) {
              //@ts-ignore - undefined ok
              this.seedBroker.nodeId = nodeId;
              //@ts-ignore - undefined ok
              this.seedBroker.connection.rack = rack;
              return assign(result, {
                [nodeId]: this.seedBroker,
              });
            }

            return assign(result, {
              [nodeId]: this.createBroker({
                logger: this.rootLogger,
                versions: this.versions,
                supportAuthenticationProtocol:
                  this.supportAuthenticationProtocol,
                connection: await this.connectionBuilder.build({
                  host,
                  port,
                  rack,
                }),
                nodeId,
              }),
            });
          },
          this.brokers
        );
        //@ts-ignore - undefined ok
        const freshBrokerIds = this.metadata.brokers
          .map(({ nodeId }: any) => `${nodeId}`)
          .sort();
        const currentBrokerIds = keys(this.brokers).sort();
        const unusedBrokerIds = arrayDiff(currentBrokerIds, freshBrokerIds);

        const brokerDisconnects = unusedBrokerIds.map((nodeId: any) => {
          const broker = this.brokers[nodeId];
          return broker.disconnect().then(() => {
            delete this.brokers[nodeId];
          });
        });

        const replacedBrokersDisconnects = replacedBrokers.map((broker: any) =>
          broker.disconnect()
        );
        await Promise.all([
          ...brokerDisconnects,
          ...replacedBrokersDisconnects,
        ]);
      } catch (e) {
        if (e.type === 'LEADER_NOT_AVAILABLE') {
          throw e;
        }

        bail(e);
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

  //deno-lint-ignore require-await
  async refreshMetadataIfNecessary(topics: string[]) {
    const shouldRefresh =
      this.metadata == null ||
      this.metadataExpireAt == null ||
      Date.now() > this.metadataExpireAt ||
      !topics.every((topic: string) =>
        //@ts-ignore undefined ok
        this.metadata.topicMetadata.some(
          (topicMetadata: any) => topicMetadata.topic === topic
        )
      );

    if (shouldRefresh) {
      return this.refreshMetadata(topics);
    }
  }

  /**
   * @public
   * @param {object} options
   * @param {string} options.nodeId
   * @returns {Promise<Broker>}
   */
  async findBroker({ nodeId }: any) {
    const broker = this.brokers[nodeId];

    if (!broker) {
      throw new KafkaJSBrokerNotFound(
        `Broker ${nodeId} not found in the cached metadata`
      );
    }

    await this.connectBroker(broker);
    return broker;
  }

  /**
   * @public
   * @param {(params: { nodeId: string, broker: Broker }) => Promise<T>} callback
   * @returns {Promise<T>}
   * @template T
   */
  async withBroker(callback: any) {
    const brokers = shuffle(keys(this.brokers));
    if (brokers.length === 0) {
      throw new KafkaJSBrokerNotFound('No brokers in the broker pool');
    }

    for (const nodeId of brokers) {
      const broker = await this.findBroker({ nodeId });
      try {
        return await callback({ nodeId, broker });
      } catch (e) {}
    }

    return null;
  }

  /**
   * @public
   * @returns {Promise<Broker>}
   */
  async findConnectedBroker() {
    const nodeIds = shuffle(keys(this.brokers));
    const connectedBrokerId = nodeIds.find((nodeId: any) =>
      this.brokers[nodeId].isConnected()
    );

    if (connectedBrokerId) {
      return await this.findBroker({ nodeId: connectedBrokerId });
    }

    // Cycle through the nodes until one connects
    for (const nodeId of nodeIds) {
      try {
        return await this.findBroker({ nodeId });
      } catch (e) {}
    }

    // Failed to connect to all known brokers, metadata might be old
    await this.connect();
    return this.seedBroker;
  }

  /**
   * @private
   * @param {Broker} broker
   * @returns {Promise<null>}
   */

  //deno-lint-ignore require-await
  async connectBroker(broker: any) {
    if (broker.isConnected()) {
      return;
    }

    return this.retrier(async (bail: any, retryCount: number, retryTime: number) => {
      try {
        await broker.connect();
      } catch (e) {
        if (
          e.name === 'KafkaJSConnectionError' ||
          e.type === 'ILLEGAL_SASL_STATE'
        ) {
          await broker.disconnect();
        }

        // To avoid reconnecting to an unavailable host, we bail on connection errors
        // and refresh metadata on a higher level before reconnecting
        if (e.name === 'KafkaJSConnectionError') {
          return bail(e);
        }

        if (e.type === 'ILLEGAL_SASL_STATE') {
          // Rebuild the connection since it can't recover from illegal SASL state
          broker.connection = await this.connectionBuilder.build({
            host: broker.connection.host,
            port: broker.connection.port,
            rack: broker.connection.rack,
          });

          this.logger.error(`Failed to connect to broker, reconnecting`, {
            retryCount,
            retryTime,
          });
          throw new KafkaJSProtocolError(e, { retriable: true });
        }

        if (e.retriable) throw e;
        this.logger.error(e, { retryCount, retryTime, stack: e.stack });
        bail(e);
      }
    });
  }
}
