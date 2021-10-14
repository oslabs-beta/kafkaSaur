//deno-lint-ignore-file no-explicit-any
import Connection from '../network/connection.ts'
import {KafkaJSConnectionError, KafkaJSNonRetriableError} from '../errors.ts'
import { ISocketFactory, Logger } from '../../index.d.ts'
import { InstrumentationEventEmitter } from '../instrumentation/emitter.ts'

/**
 * @typedef {Object} ConnectionBuilder
 * @property {(destination?: { host?: string, port?: number, rack?: string }) => Promise<Connection>} build
 */

/**
 * @param {Object} options
 * @param {import("../../types").ISocketFactory} [options.socketFactory]
 * @param {string[]|(() => string[])} options.brokers
 * @param {Object} [options.ssl]
 * @param {Object} [options.sasl]
 * @param {string} options.clientId
 * @param {number} options.requestTimeout
 * @param {boolean} [options.enforceRequestTimeout]
 * @param {number} [options.connectionTimeout]
 * @param {number} [options.maxInFlightRequests]
 * @param {import("../../types").RetryOptions} [options.retry]
 * @param {import("../../types").Logger} options.logger
 * @param {import("../instrumentation/emitter")} [options.instrumentationEmitter]
 * @returns {ConnectionBuilder}
 */

export default({

  socketFactory,
  brokers,
  ssl,
  sasl,
  clientId,
  requestTimeout,
  enforceRequestTimeout,
  connectionTimeout,
  maxInFlightRequests,
  logger,
  instrumentationEmitter = null
}: {
  socketFactory: ISocketFactory
  brokers: string[] | (()=>string[])
  ssl: any
  sasl: any
  clientId: string
  requestTimeout: number
  enforceRequestTimeout: boolean
  connectionTimeout: number
  maxInFlightRequests: number
  logger: Logger
  instrumentationEmitter: InstrumentationEventEmitter | null
}) => {
  let index = 0

  const getBrokers = async () => {
    if (!brokers) {
      throw new KafkaJSNonRetriableError(`Failed to connect: brokers parameter should not be null`)
    }

    // static list
    if (Array.isArray(brokers)) {
      if (!brokers.length) {
        throw new KafkaJSNonRetriableError(`Failed to connect: brokers array is empty`)
      }
      return brokers
    }

    // dynamic brokers
    let list
    try {
      list = await brokers()
    } catch (e) {
      const wrappedError = new KafkaJSConnectionError(
        `Failed to connect: "config.brokers" threw: ${e.message}`
      )
      wrappedError.stack = `${wrappedError.name}\n  Caused by: ${e.stack}`
      throw wrappedError
    }

    if (!list || list.length === 0) {
      throw new KafkaJSConnectionError(
        `Failed to connect: "config.brokers" returned void or empty array`
      )
    }
    return list
  }

  return {
    build: async ({
      host,
      port,
      rack
    }: any = {}) => {
      if (!host) {
        const list = await getBrokers()

        const randomBroker = list[index++ % list.length]

        host = randomBroker.split(':')[0]
        port = Number(randomBroker.split(':')[1])
      }

      return new Connection({
        host,
        port,
        rack,
        sasl,
        ssl,
        clientId,
        socketFactory,
        connectionTimeout,
        requestTimeout,
        enforceRequestTimeout,
        maxInFlightRequests,
        instrumentationEmitter,
        logger,
      })
    },
  };
}
