import { KafkaJSRequestTimeoutError, KafkaJSNonRetriableError } from '../../errors.ts';
import events from '../instrumentationEvents.ts';

const PRIVATE = {
  STATE: Symbol('private:SocketRequest:state') as unknown as string,
  EMIT_EVENT: Symbol('private:SocketRequest:emitEvent') as unknown as string,
}

const REQUEST_STATE = {
  PENDING: Symbol('PENDING') as unknown as string,
  SENT: Symbol('SENT') as unknown as string,
  COMPLETED: Symbol('COMPLETED') as unknown as string,
  REJECTED: Symbol('REJECTED') as unknown as string,
}

/**
 * SocketRequest abstracts the life cycle of a socket request, making it easier to track
 * request durations and to have individual timeouts per request.
 *
 * @typedef {Object} SocketRequest
 * @property {number} createdAt
 * @property {number} sentAt
 * @property {number} pendingDuration
 * @property {number} duration
 * @property {number} requestTimeout
 * @property {string} broker
 * @property {string} clientId
 * @property {RequestEntry} entry
 * @property {boolean} expectResponse
 * @property {Function} send
 * @property {Function} timeout
 *
 * @typedef {Object} RequestEntry
 * @property {string} apiKey
 * @property {string} apiName
 * @property {number} apiVersion
 * @property {number} correlationId
 * @property {Function} resolve
 * @property {Function} reject
 */
export class SocketRequest {
  [key: string]: any;
  /**
   * @param {Object} options
   * @param {number} options.requestTimeout
   * @param {string} options.broker - e.g: 127.0.0.1:9092
   * @param {string} options.clientId
   * @param {RequestEntry} options.entry
   * @param {boolean} options.expectResponse
   * @param {Function} options.send
   * @param {() => void} options.timeout
   * @param {import("../../instrumentation/emitter")} [options.instrumentationEmitter=null]
   */
  constructor({
    requestTimeout,
    broker,
    clientId,
    entry,
    expectResponse,
    send,
    timeout,
    instrumentationEmitter = null
  }: any) {
    this.createdAt = Date.now()
    this.requestTimeout = requestTimeout
    this.broker = broker
    this.clientId = clientId
    this.entry = entry
    this.correlationId = entry.correlationId
    this.expectResponse = expectResponse
    this.sendRequest = send
    this.timeoutHandler = timeout

    this.sentAt = null
    this.duration = null
    this.pendingDuration = null

    this[(PRIVATE as any).STATE] = REQUEST_STATE.PENDING;
    this[(PRIVATE as any).EMIT_EVENT] = (eventName: any, payload: any) => instrumentationEmitter && instrumentationEmitter.emit(eventName, payload);
  }

  send() {
    this.throwIfInvalidState({
      accepted: [REQUEST_STATE.PENDING],
      next: REQUEST_STATE.SENT,
    })

    this.sendRequest()
    this.sentAt = Date.now()
    this.pendingDuration = this.sentAt - this.createdAt
    this[(PRIVATE as any).STATE] = REQUEST_STATE.SENT;
  }

  timeoutRequest() {
    const { apiName, apiKey, apiVersion } = this.entry
    const requestInfo = `${apiName}(key: ${apiKey}, version: ${apiVersion})`
    const eventData = {
      broker: this.broker,
      clientId: this.clientId,
      correlationId: this.correlationId,
      createdAt: this.createdAt,
      sentAt: this.sentAt,
      pendingDuration: this.pendingDuration,
    }

    this.timeoutHandler()
    this.rejected(new KafkaJSRequestTimeoutError(`Request ${requestInfo} timed out`, eventData))
    this[(PRIVATE as any).EMIT_EVENT](events.NETWORK_REQUEST_TIMEOUT, {
    ...eventData,
    apiName,
    apiKey,
    apiVersion,
});
  }

  completed({
    size,
    payload
  }: any) {
    this.throwIfInvalidState({
      accepted: [REQUEST_STATE.SENT],
      next: REQUEST_STATE.COMPLETED,
    })

    const { entry, correlationId, broker, clientId, createdAt, sentAt, pendingDuration } = this

    this[(PRIVATE as any).STATE] = REQUEST_STATE.COMPLETED;
    this.duration = Date.now() - this.sentAt
    entry.resolve({ correlationId, entry, size, payload })

    this[(PRIVATE as any).EMIT_EVENT](events.NETWORK_REQUEST, {
    broker,
    clientId,
    correlationId,
    size,
    createdAt,
    sentAt,
    pendingDuration,
    duration: this.duration,
    apiName: entry.apiName,
    apiKey: entry.apiKey,
    apiVersion: entry.apiVersion,
});
  }

  rejected(error: any) {
    this.throwIfInvalidState({
      accepted: [REQUEST_STATE.PENDING, REQUEST_STATE.SENT],
      next: REQUEST_STATE.REJECTED,
    })

    this[(PRIVATE as any).STATE] = REQUEST_STATE.REJECTED;
    this.duration = Date.now() - this.sentAt
    this.entry.reject(error)
  }

  /**
   * @private
   */
  throwIfInvalidState({
    accepted,
    next
  }: any) {
    if (accepted.includes(this[(PRIVATE as any).STATE])) {
      return
    }

    const current = this[(PRIVATE as any).STATE].toString();

    throw new KafkaJSNonRetriableError(
      `Invalid state, can't transition from ${current} to ${next.toString()}`
    )
  }
}
