// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.setTimeout(3000)

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sleep'.
const sleep = require('../../utils/sleep')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
const { newLogger } = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Instrument... Remove this comment to see the full error message
const InstrumentationEventEmitter = require('../../instrumentation/emitter')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'events'.
const events = require('../instrumentationEvents')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestQue... Remove this comment to see the full error message
const RequestQueue = require('./index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSInv... Remove this comment to see the full error message
const { KafkaJSInvariantViolation } = require('../../errors')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Network > RequestQueue', () => {
  let requestQueue: any
  let correlationId = 0

  const createEntry = () => ({
    correlationId: correlationId++,
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    resolve: jest.fn(),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    reject: jest.fn(),
  })

  const createRequestQueue = (args = {}) =>
    new RequestQueue({
      maxInFlightRequests: 2,
      requestTimeout: 50,
      clientId: 'KafkaJS',
      broker: 'localhost:9092',
      logger: newLogger(),
      ...args,
    })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    requestQueue = createRequestQueue()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#waitForPendingRequests', () => {
    let request: any, send, size: any, payload: any

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      send = jest.fn()
      payload = { ok: true }
      size = 32
      request = {
        sendRequest: send,
        entry: createEntry(),
        expectResponse: true,
      }
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('blocks until all pending requests are fulfilled', async () => {
      const emitter = new InstrumentationEventEmitter()
      requestQueue = createRequestQueue({
        instrumentationEmitter: emitter,
      })

      const removeListener = emitter.addListener(events.NETWORK_REQUEST_QUEUE_SIZE, (event: any) => {
        if (event.payload.queueSize === 0) {
          requestQueue.fulfillRequest({
            correlationId: request.entry.correlationId,
            payload,
            size,
          })
        }
      })

      requestQueue.maybeThrottle(50)
      requestQueue.push(request)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(requestQueue.pending.length).toEqual(1)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(requestQueue.inflight.size).toEqual(0)

      await requestQueue.waitForPendingRequests()

      removeListener()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(requestQueue.pending.length).toEqual(0)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(requestQueue.inflight.size).toEqual(0)
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#push', () => {
    let request: any, send: any

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      send = jest.fn()
      request = {
        sendRequest: send,
        entry: createEntry(),
        expectResponse: true,
      }
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when there are no inflight requests', () => {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('calls send on the request', () => {
        requestQueue.push(request)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(send).toHaveBeenCalledTimes(1)
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('when the request does not require a response', () => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
        beforeEach(() => {
          request.expectResponse = false
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('deletes the inflight request and complete the request', () => {
          requestQueue.push(request)
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(request.entry.resolve).toHaveBeenCalledWith(
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect.objectContaining({ size: 0, payload: null })
          )

          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(requestQueue.inflight.size).toEqual(0)
        })
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when there are many inflight requests', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
      beforeEach(() => {
        while (requestQueue.inflight.size < requestQueue.maxInFlightRequests) {
          const request = {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
            sendRequest: jest.fn(),
            entry: createEntry(),
            expectResponse: true,
          }

          requestQueue.push(request)
        }
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('adds the new request to the pending queue', () => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(requestQueue.inflight.size).toEqual(requestQueue.maxInFlightRequests)
        requestQueue.push(request)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(requestQueue.inflight.size).toEqual(requestQueue.maxInFlightRequests)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(requestQueue.pending.length).toEqual(1)
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('when the request does not require a response', () => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
        beforeEach(() => {
          request.expectResponse = false
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('deletes the inflight request and complete the request when it is processed', () => {
          requestQueue.push(request)

          // Process the queue except the entry for the request, which should get handled automatically
          for (const correlationId of requestQueue.inflight.keys()) {
            if (correlationId !== request.entry.correlationId) {
              // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
              requestQueue.fulfillRequest({ correlationId, size: 1, payload: Buffer.from('a') })
            }
          }
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(request.entry.resolve).toHaveBeenCalledWith(
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect.objectContaining({ size: 0, payload: null })
          )

          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(requestQueue.inflight.size).toEqual(0)
        })
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('when maxInFlightRequests is null', () => {
        let maxInFlightRequests: any

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
        beforeEach(() => {
          maxInFlightRequests = requestQueue.maxInFlightRequests
          requestQueue.maxInFlightRequests = null
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('does not enforce the number of inflight requests', () => {
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(requestQueue.inflight.size).toEqual(maxInFlightRequests)
          requestQueue.push(request)
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(requestQueue.inflight.size).toEqual(maxInFlightRequests + 1)
        })
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('respects the client-side throttling', async () => {
      // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
      const sendDone = new Promise((resolve: any) => {
        request.sendRequest = () => {
          resolve(Date.now())
        }
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(requestQueue.canSendSocketRequestImmediately())

      const before = Date.now()
      const throttledUntilBefore = requestQueue.throttledUntil
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(throttledUntilBefore).toBeLessThan(before)

      const clientSideThrottleTime = 500
      requestQueue.maybeThrottle(clientSideThrottleTime)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(requestQueue.throttledUntil).toBeGreaterThanOrEqual(before + clientSideThrottleTime)
      requestQueue.push(request)

      const sentAt = await sendDone
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(sentAt).toBeGreaterThanOrEqual(before + clientSideThrottleTime)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not allow for a inflight correlation ids collision', async () => {
      requestQueue.inflight.set(request.entry.correlationId, 'already existing inflight')
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => {
        requestQueue.push(request)
      }).toThrowError(new KafkaJSInvariantViolation('Correlation id already exists'))
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#fulfillRequest', () => {
    let request: any, send: any, size: any, payload: any

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      send = jest.fn()
      payload = { ok: true }
      size = 32
      request = {
        sendRequest: send,
        entry: createEntry(),
        expectResponse: true,
      }
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('deletes the inflight request and calls completed on the request', () => {
      requestQueue.push(request)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(requestQueue.inflight.size).toEqual(1)

      requestQueue.fulfillRequest({
        correlationId: request.entry.correlationId,
        payload,
        size,
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(requestQueue.inflight.size).toEqual(0)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.entry.resolve).toHaveBeenCalledWith(expect.objectContaining({ size, payload }))
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when there are pending requests', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
      beforeEach(() => {
        while (requestQueue.inflight.size < requestQueue.maxInFlightRequests) {
          const request = {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
            sendRequest: jest.fn(),
            entry: createEntry(),
            expectResponse: true,
          }

          requestQueue.push(request)
        }
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('calls send on the earliest pending request', () => {
        requestQueue.push(request)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(requestQueue.pending.length).toEqual(1)

        const currentInflightSize = requestQueue.inflight.size

        // Pick one of the inflight requests to fulfill
        const correlationId = requestQueue.inflight.keys().next().value
        requestQueue.fulfillRequest({
          correlationId: correlationId,
          payload,
          size,
        })

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(send).toHaveBeenCalled()
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(requestQueue.pending.length).toEqual(0)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(requestQueue.inflight.size).toEqual(currentInflightSize)
      })
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#rejectAll', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('calls rejected on all requests (inflight + pending)', () => {
      const allRequests = []
      while (requestQueue.inflight.size < requestQueue.maxInFlightRequests) {
        const request = {
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
          sendRequest: jest.fn(),
          entry: createEntry(),
          expectResponse: true,
        }

        requestQueue.push(request)
        allRequests.push(request)
      }

      const pendingRequest = {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        sendRequest: jest.fn(),
        entry: createEntry(),
        expectResponse: true,
      }

      requestQueue.push(pendingRequest)
      allRequests.push(pendingRequest)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(requestQueue.inflight.size).toEqual(requestQueue.maxInFlightRequests)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(requestQueue.pending.length).toEqual(1)

      const error = new Error('Broker closed the connection')
      requestQueue.rejectAll(error)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(requestQueue.inflight.size).toEqual(0)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(requestQueue.pending.length).toEqual(0)

      for (const request of allRequests) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(request.entry.reject).toHaveBeenCalledWith(error)
      }
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('instrumentation events', () => {
    let emitter: any, removeListener: any, eventCalled: any, request: any, payload: any, size: any, requestTimeout: any

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      requestTimeout = 1
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      eventCalled = jest.fn()
      emitter = new InstrumentationEventEmitter()
      requestQueue = createRequestQueue({
        instrumentationEmitter: emitter,
        enforceRequestTimeout: true,
        requestTimeout,
      })
      request = {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        sendRequest: jest.fn(),
        entry: createEntry(),
        expectResponse: true,
      }
      payload = { ok: true }
      size = 32
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
    afterEach(() => {
      removeListener && removeListener()
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not emit the event if the queue size remains the same', () => {
      emitter.addListener(events.NETWORK_REQUEST_QUEUE_SIZE, eventCalled)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(requestQueue.pending.length).toEqual(0)
      requestQueue.push(request)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(requestQueue.pending.length).toEqual(0)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(eventCalled).not.toHaveBeenCalled()
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('emits NETWORK_REQUEST_QUEUE_SIZE when a new request is added', () => {
      emitter.addListener(events.NETWORK_REQUEST_QUEUE_SIZE, eventCalled)

      while (requestQueue.inflight.size < requestQueue.maxInFlightRequests) {
        const request = {
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
          sendRequest: jest.fn(),
          entry: createEntry(),
          expectResponse: true,
        }

        requestQueue.push(request)
      }

      requestQueue.push(request)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(eventCalled).toHaveBeenCalledWith({
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        id: expect.any(Number),
        type: 'network.request_queue_size',
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        timestamp: expect.any(Number),
        payload: {
          broker: 'localhost:9092',
          clientId: 'KafkaJS',
          queueSize: requestQueue.pending.length,
        },
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('emits NETWORK_REQUEST_QUEUE_SIZE when a request is removed', () => {
      emitter.addListener(events.NETWORK_REQUEST_QUEUE_SIZE, eventCalled)

      while (requestQueue.inflight.size < requestQueue.maxInFlightRequests) {
        const request = {
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
          sendRequest: jest.fn(),
          entry: createEntry(),
          expectResponse: true,
        }

        requestQueue.push(request)
      }

      requestQueue.push(request)

      // Pick one of the inflight requests to fulfill
      const correlationId = requestQueue.inflight.keys().next().value
      requestQueue.fulfillRequest({
        correlationId,
        payload,
        size,
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(eventCalled).toHaveBeenCalledTimes(2)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(eventCalled).toHaveBeenCalledWith({
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        id: expect.any(Number),
        type: 'network.request_queue_size',
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        timestamp: expect.any(Number),
        payload: {
          broker: 'localhost:9092',
          clientId: 'KafkaJS',
          queueSize: 0,
        },
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('emits NETWORK_REQUEST_QUEUE_SIZE when the requests are rejected', () => {
      emitter.addListener(events.NETWORK_REQUEST_QUEUE_SIZE, eventCalled)
      const error = new Error('Broker closed the connection')
      requestQueue.rejectAll(error)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(eventCalled).toHaveBeenCalledWith({
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        id: expect.any(Number),
        type: 'network.request_queue_size',
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        timestamp: expect.any(Number),
        payload: {
          broker: 'localhost:9092',
          clientId: 'KafkaJS',
          queueSize: 0,
        },
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('emits NETWORK_REQUEST_TIMEOUT', async () => {
      emitter.addListener(events.NETWORK_REQUEST_TIMEOUT, eventCalled)
      requestQueue.scheduleRequestTimeoutCheck()
      requestQueue.push(request)

      await sleep(requestTimeout + 10)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(eventCalled).toHaveBeenCalledWith({
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        id: expect.any(Number),
        type: 'network.request_timeout',
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        timestamp: expect.any(Number),
        payload: {
          apiKey: request.entry.apiKey,
          apiName: request.entry.apiName,
          apiVersion: request.entry.apiVersion,
          broker: 'localhost:9092',
          clientId: 'KafkaJS',
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          correlationId: expect.any(Number),
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          createdAt: expect.any(Number),
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          pendingDuration: expect.any(Number),
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          sentAt: expect.any(Number),
        },
      })
    })
  })
})
