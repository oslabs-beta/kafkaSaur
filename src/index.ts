//deno-lint-ignore-file require-await no-explicit-any ban-unused-ignore
/** @format */

import { createLogger, LEVELS } from './loggers/index.ts';

import { InstrumentationEventEmitter } from './instrumentation/emitter.ts';
import LoggerConsole from './loggers/console.ts';
import { Cluster } from './cluster/index.ts';
import createProducer from './producer/index.ts';
import createConsumer from './consumer/index.ts';
import createAdmin from './admin/index.ts';
import ISOLATION_LEVEL from './protocol/isolationLevel.ts';
import defaultSocketFactory from './network/socketFactory.ts';
const { INFO } = LEVELS;
const PRIVATE = {
  CREATE_CLUSTER: Symbol('private:Kafka:createCluster') as unknown as string,
  CLUSTER_RETRY: Symbol('private:Kafka:clusterRetry') as unknown as string,
  LOGGER: Symbol('private:Kafka:logger') as unknown as string,
  OFFSETS: Symbol('private:Kafka:offsets') as unknown as string,
};

import { KafkaConfig, ProducerConfig, ConsumerConfig } from '../index.d.ts'


const DEFAULT_METADATA_MAX_AGE = 300000;

export default class Client {
  [key: string]: any;
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
    logCreator = LoggerConsole,
  }: KafkaConfig) {
    this[PRIVATE.OFFSETS] = new Map();
    this[PRIVATE.LOGGER] = createLogger({ level: logLevel, logCreator });
    this[PRIVATE.CLUSTER_RETRY] = retry;
    this[PRIVATE.CREATE_CLUSTER] = ({
      metadataMaxAge,
      allowAutoTopicCreation = true,
      maxInFlightRequests = null,
      instrumentationEmitter = null,
      isolationLevel,
    }: any) =>
      new Cluster({
        logger: this[PRIVATE.LOGGER],
        retry: this[PRIVATE.CLUSTER_RETRY],
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
      });
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
    maxInFlightRequests,
  }: ProducerConfig = {}) {
    const instrumentationEmitter = new InstrumentationEventEmitter();
    const cluster = this[PRIVATE.CREATE_CLUSTER]({
      metadataMaxAge,
      allowAutoTopicCreation,
      maxInFlightRequests,
      instrumentationEmitter,
    });

    return createProducer({
      retry: { ...this[PRIVATE.CLUSTER_RETRY], ...retry },
      logger: this[PRIVATE.LOGGER],
      cluster,
      createPartitioner,
      idempotent,
      transactionalId,
      transactionTimeout,
      instrumentationEmitter,
    });
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
    rackId = '',
  }: ConsumerConfig = {}) {
    const isolationLevel = readUncommitted
      ? ISOLATION_LEVEL.READ_UNCOMMITTED
      : ISOLATION_LEVEL.READ_COMMITTED;

    const instrumentationEmitter = new InstrumentationEventEmitter();
    const cluster = this[PRIVATE.CREATE_CLUSTER]({
      metadataMaxAge,
      allowAutoTopicCreation,
      maxInFlightRequests,
      isolationLevel,
      instrumentationEmitter,
    });

    return createConsumer({
      retry: { ...this[PRIVATE.CLUSTER_RETRY], ...retry },
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
    });
  }

  /**
   * @public
   */
  admin({ retry }: any = {}) {
    const instrumentationEmitter = new InstrumentationEventEmitter();
    const cluster = this[PRIVATE.CREATE_CLUSTER]({
      allowAutoTopicCreation: false,
      instrumentationEmitter,
    });

    return createAdmin({
      retry: { ...this[PRIVATE.CLUSTER_RETRY], ...retry },
      logger: this[PRIVATE.LOGGER],
      instrumentationEmitter,
      cluster,
    });
  }

  /**
   * @public
   */
  logger() {
    return this[PRIVATE.LOGGER];
  }
}
