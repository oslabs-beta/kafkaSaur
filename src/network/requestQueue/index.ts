// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EventEmitt... Remove this comment to see the full error message
const { EventEmitter } = require('events')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SocketRequ... Remove this comment to see the full error message
const SocketRequest = require('./socketRequest')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'events'.
const events = require('../instrumentationEvents')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSInv... Remove this comment to see the full error message
const { KafkaJSInvariantViolation } = require('../../errors')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PRIVATE'.
const PRIVATE = {
  // @ts-expect-error ts-migrate(2585) FIXME: 'Symbol' only refers to a type, but is being used ... Remove this comment to see the full error message
  EMIT_QUEUE_SIZE_EVENT: Symbol('private:RequestQueue:emitQueueSizeEvent'),
  // @ts-expect-error ts-migrate(2585) FIXME: 'Symbol' only refers to a type, but is being used ... Remove this comment to see the full error message
  EMIT_REQUEST_QUEUE_EMPTY: Symbol('private:RequestQueue:emitQueueEmpty'),
}

const REQUEST_QUEUE_EMPTY = 'requestQueueEmpty'

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class RequestQueue extends EventEmitter {
  broker: any;
  clientId: any;
  emit: any;
  enforceRequestTimeout: any;
  inflight: any;
  instrumentationEmitter: any;
  isConnected: any;
  logger: any;
  maxInFlightRequests: any;
  once: any;
  pending: any;
  requestTimeout: any;
  requestTimeoutIntervalId: any;
  throttleCheckTimeoutId: any;
  throttledUntil: any;
  /**
   * @param {Object} options
   * @param {number} options.maxInFlightRequests
   * @param {number} options.requestTimeout
   * @param {boolean} options.enforceRequestTimeout
   * @param {string} options.clientId
   * @param {string} options.broker
   * @param {import("../../../types").Logger} options.logger
   * @param {import("../../instrumentation/emitter")} [options.instrumentationEmitter=null]
   * @param {() => boolean} [options.isConnected]
   */
  constructor({
    instrumentationEmitter = null,
    maxInFlightRequests,
    requestTimeout,
    enforceRequestTimeout,
    clientId,
    broker,
    logger,
    isConnected = () => true
  }: any) {
    super()
    this.instrumentationEmitter = instrumentationEmitter
    this.maxInFlightRequests = maxInFlightRequests
    this.requestTimeout = requestTimeout
    this.enforceRequestTimeout = enforceRequestTimeout
    this.clientId = clientId
    this.broker = broker
    this.logger = logger
    this.isConnected = isConnected

    // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Map'. Do you need to change your... Remove this comment to see the full error message
    this.inflight = new Map()
    this.pending = []

    /**
     * Until when this request queue is throttled and shouldn't send requests
     *
     * The value represents the timestamp of the end of the throttling in ms-since-epoch. If the value
     * is smaller than the current timestamp no throttling is active.
     *
     * @type {number}
     */
    this.throttledUntil = -1

    /**
     * Timeout id if we have scheduled a check for pending requests due to client-side throttling
     *
     * @type {null|NodeJS.Timeout}
     */
    this.throttleCheckTimeoutId = null

    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    this[(PRIVATE as any).EMIT_REQUEST_QUEUE_EMPTY] = () => {
    if (this.pending.length === 0 && this.inflight.size === 0) {
        this.emit(REQUEST_QUEUE_EMPTY);
    }
};

    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    this[(PRIVATE as any).EMIT_QUEUE_SIZE_EVENT] = () => {
    instrumentationEmitter &&
        instrumentationEmitter.emit(events.NETWORK_REQUEST_QUEUE_SIZE, {
            broker: this.broker,
            clientId: this.clientId,
            queueSize: this.pending.length,
        });
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    this[PRIVATE.EMIT_REQUEST_QUEUE_EMPTY]();
};

      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      this[(PRIVATE as any).EMIT_REQUEST_QUEUE_EMPTY]();
    }
  }

  /**
   * @public
   */
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'scheduleRequestTimeoutCheck'.
  scheduleRequestTimeoutCheck() {
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    if (this.enforceRequestTimeout) {
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      this.destroy()

      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      this.requestTimeoutIntervalId = setInterval(() => {
        // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
        this.inflight.forEach((request: any) => {
          if (Date.now() - request.sentAt > request.requestTimeout) {
            request.timeoutRequest()
          }
        })

        // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
        if (!this.isConnected()) {
          // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
          this.destroy()
        }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'requestTimeout' does not exist on type '... Remove this comment to see the full error message
      }, Math.min(this.requestTimeout, 100))
    }
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'maybeThrottle'.
  maybeThrottle(clientSideThrottleTime: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clientSideThrottleTime'.
    if (clientSideThrottleTime) {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clientSideThrottleTime'.
      const minimumThrottledUntil = Date.now() + clientSideThrottleTime
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      this.throttledUntil = Math.max(minimumThrottledUntil, this.throttledUntil)
    }
  }

  /**
   * @typedef {Object} PushedRequest
   * @property {import("./socketRequest").RequestEntry} entry
   * @property {boolean} expectResponse
   * @property {Function} sendRequest
   * @property {number} [requestTimeout]
   *
   * @public
   * @param {PushedRequest} pushedRequest
   */
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'push'.
  push(pushedRequest: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'pushedRequest'.
    const { correlationId } = pushedRequest.entry
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'requestTimeout' does not exist on type '... Remove this comment to see the full error message
    const defaultRequestTimeout = this.requestTimeout
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'pushedRequest'.
    const customRequestTimeout = pushedRequest.requestTimeout

    // Some protocol requests have custom request timeouts (e.g JoinGroup, Fetch, etc). The custom
    // timeouts are influenced by user configurations, which can be lower than the default requestTimeout
    const requestTimeout = Math.max(defaultRequestTimeout, customRequestTimeout || 0)

    const socketRequest = new SocketRequest({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'pushedRequest'.
      entry: pushedRequest.entry,
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'pushedRequest'.
      expectResponse: pushedRequest.expectResponse,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'broker' does not exist on type 'typeof g... Remove this comment to see the full error message
      broker: this.broker,
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      clientId: this.clientId,
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      instrumentationEmitter: this.instrumentationEmitter,
      requestTimeout,
      send: () => {
        // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
        if (this.inflight.has(correlationId)) {
          throw new KafkaJSInvariantViolation('Correlation id already exists')
        }
        // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
        this.inflight.set(correlationId, socketRequest)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'pushedRequest'.
        pushedRequest.sendRequest()
      },
      timeout: () => {
        // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
        this.inflight.delete(correlationId)
        // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
        this.checkPendingRequests()
      },
    })

    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    if (this.canSendSocketRequestImmediately()) {
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      this.sendSocketRequest(socketRequest)
      return
    }

    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.pending.push(socketRequest)
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.scheduleCheckPendingRequests()

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'logger' does not exist on type 'typeof g... Remove this comment to see the full error message
    this.logger.debug(`Request enqueued`, {
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      clientId: this.clientId,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'broker' does not exist on type 'typeof g... Remove this comment to see the full error message
      broker: this.broker,
      correlationId,
    })

    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    this[(PRIVATE as any).EMIT_QUEUE_SIZE_EVENT]();
  }

  /**
   * @param {SocketRequest} socketRequest
   */
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'sendSocketRequest'.
  sendSocketRequest(socketRequest: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'socketRequest'.
    socketRequest.send()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'socketRequest'.
    if (!socketRequest.expectResponse) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'logger' does not exist on type 'typeof g... Remove this comment to see the full error message
      this.logger.debug(`Request does not expect a response, resolving immediately`, {
        // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        clientId: this.clientId,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'broker' does not exist on type 'typeof g... Remove this comment to see the full error message
        broker: this.broker,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'socketRequest'.
        correlationId: socketRequest.correlationId,
      })

      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      this.inflight.delete(socketRequest.correlationId)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'socketRequest'.
      socketRequest.completed({ size: 0, payload: null })
    }
  }

  /**
   * @public
   * @param {object} response
   * @param {number} response.correlationId
   * @param {Buffer} response.payload
   * @param {number} response.size
   */
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'fulfillRequest'.
  fulfillRequest({
    // @ts-expect-error ts-migrate(18004) FIXME: No value exists in scope for the shorthand propert... Remove this comment to see the full error message
    correlationId,
    // @ts-expect-error ts-migrate(18004) FIXME: No value exists in scope for the shorthand propert... Remove this comment to see the full error message
    payload,
    // @ts-expect-error ts-migrate(18004) FIXME: No value exists in scope for the shorthand propert... Remove this comment to see the full error message
    size
  // @ts-expect-error ts-migrate(2693) FIXME: 'any' only refers to a type, but is being used as ... Remove this comment to see the full error message
  }: any) {
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    const socketRequest = this.inflight.get(correlationId)
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.inflight.delete(correlationId)
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.checkPendingRequests()

    if (socketRequest) {
      // @ts-expect-error ts-migrate(18004) FIXME: No value exists in scope for the shorthand propert... Remove this comment to see the full error message
      socketRequest.completed({ size, payload })
    } else {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'logger' does not exist on type 'typeof g... Remove this comment to see the full error message
      this.logger.warn(`Response without match`, {
        // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        clientId: this.clientId,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'broker' does not exist on type 'typeof g... Remove this comment to see the full error message
        broker: this.broker,
        // @ts-expect-error ts-migrate(18004) FIXME: No value exists in scope for the shorthand propert... Remove this comment to see the full error message
        correlationId,
      })
    }

    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    this[(PRIVATE as any).EMIT_REQUEST_QUEUE_EMPTY]();
  }

  /**
   * @public
   * @param {Error} error
   */
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'rejectAll'.
  rejectAll(error: any) {
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    const requests = [...this.inflight.values(), ...this.pending]

    for (const socketRequest of requests) {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'error'.
      socketRequest.rejected(error)
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      this.inflight.delete(socketRequest.correlationId)
    }

    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.pending = []
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.inflight.clear()
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    this[(PRIVATE as any).EMIT_QUEUE_SIZE_EVENT]();
  }

  /**
   * @public
   */
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'waitForPendingRequests'.
  waitForPendingRequests() {
    return new Promise((resolve: any) => {
      if (this.pending.length === 0 && this.inflight.size === 0) {
        return resolve()
      }

      this.logger.debug('Waiting for pending requests', {
        clientId: this.clientId,
        broker: this.broker,
        currentInflightRequests: this.inflight.size,
        currentPendingQueueSize: this.pending.length,
      })

      this.once(REQUEST_QUEUE_EMPTY, () => resolve())
    });
  }

  /**
   * @public
   */
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'destroy'.
  destroy() {
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    clearInterval(this.requestTimeoutIntervalId)
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    clearTimeout(this.throttleCheckTimeoutId)
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.throttleCheckTimeoutId = null
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'canSendSocketRequestImmediately'... Remove this comment to see the full error message
  canSendSocketRequestImmediately() {
    const shouldEnqueue =
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      (this.maxInFlightRequests != null && this.inflight.size >= this.maxInFlightRequests) ||
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      this.throttledUntil > Date.now()

    return !shouldEnqueue
  }

  /**
   * Check and process pending requests either now or in the future
   *
   * This function will send out as many pending requests as possible taking throttling and
   * in-flight limits into account.
   */
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'checkPendingRequests'.
  checkPendingRequests() {
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    while (this.pending.length > 0 && this.canSendSocketRequestImmediately()) {
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      const pendingRequest = this.pending.shift() // first in first out
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      this.sendSocketRequest(pendingRequest)

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'logger' does not exist on type 'typeof g... Remove this comment to see the full error message
      this.logger.debug(`Consumed pending request`, {
        // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        clientId: this.clientId,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'broker' does not exist on type 'typeof g... Remove this comment to see the full error message
        broker: this.broker,
        correlationId: pendingRequest.correlationId,
        pendingDuration: pendingRequest.pendingDuration,
        // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        currentPendingQueueSize: this.pending.length,
      })

      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      this[(PRIVATE as any).EMIT_QUEUE_SIZE_EVENT]();
    }

    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.scheduleCheckPendingRequests()
  }

  /**
   * Ensure that pending requests will be checked in the future
   *
   * If there is a client-side throttling in place this will ensure that we will check
   * the pending request queue eventually.
   */
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'scheduleCheckPendingRequests'.
  scheduleCheckPendingRequests() {
    // If we're throttled: Schedule checkPendingRequests when the throttle
    // should be resolved. If there is already something scheduled we assume that that
    // will be fine, and potentially fix up a new timeout if needed at that time.
    // Note that if we're merely "overloaded" by having too many inflight requests
    // we will anyways check the queue when one of them gets fulfilled.
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    const timeUntilUnthrottled = this.throttledUntil - Date.now()
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    if (timeUntilUnthrottled > 0 && !this.throttleCheckTimeoutId) {
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      this.throttleCheckTimeoutId = setTimeout(() => {
        // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
        this.throttleCheckTimeoutId = null
        // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
        this.checkPendingRequests()
      }, timeUntilUnthrottled)
    }
  }
}
