// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SocketRequ... Remove this comment to see the full error message
const SocketRequest = require('./socketRequest')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSReq... Remove this comment to see the full error message
const { KafkaJSRequestTimeoutError, KafkaJSNonRetriableError } = require('../../errors')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Instrument... Remove this comment to see the full error message
const InstrumentationEventEmitter = require('../../instrumentation/emitter')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'events'.
const events = require('../instrumentationEvents')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Network > SocketRequest', () => {
  let request: any, sendRequest: any, timeoutHandler: any
  let correlationId = 0
  const requestTimeout = 50
  const size = 32
  const payload = { ok: true }

  const createSocketRequest = (args = {}) =>
    new SocketRequest({
      requestTimeout,
      broker: 'localhost:9092',
      clientId: 'KafkaJS',
      expectResponse: true,
      entry: {
        apiKey: 0,
        apiVersion: 4,
        apiName: 'Produce',
        correlationId: correlationId++,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        resolve: jest.fn(),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        reject: jest.fn(),
      },
      ...args,
    })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    sendRequest = jest.fn()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    timeoutHandler = jest.fn()
    request = createSocketRequest({
      send: sendRequest,
      timeout: timeoutHandler,
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#send', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('sends the request using the provided function', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.sentAt).toEqual(null)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.pendingDuration).toEqual(null)

      request.enforceRequestTimeout = true
      request.send()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(sendRequest).toHaveBeenCalled()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.sentAt).toEqual(expect.any(Number))
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.pendingDuration).toEqual(expect.any(Number))
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not call sendRequest more than once', () => {
      request.send()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => request.send()).toThrow(KafkaJSNonRetriableError)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(sendRequest).toHaveBeenCalledTimes(1)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('executes the timeoutHandler when it times out', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      jest.spyOn(request, 'rejected')
      request.enforceRequestTimeout = true
      request.send()
      request.timeoutRequest()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.rejected).toHaveBeenCalled()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.entry.reject).toHaveBeenCalledWith(expect.any(KafkaJSRequestTimeoutError))
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(timeoutHandler).toHaveBeenCalled()
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#completed', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('resolves the promise', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.duration).toEqual(null)

      request.send()
      request.completed({ size, payload })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.entry.resolve).toHaveBeenCalledWith({
        correlationId: request.correlationId,
        entry: request.entry,
        size,
        payload,
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.duration).toEqual(expect.any(Number))
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not call resolve more than once', () => {
      request.send()
      request.completed({ size, payload })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => request.completed({ size, payload })).toThrow(KafkaJSNonRetriableError)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.entry.resolve).toHaveBeenCalledTimes(1)
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#rejected', () => {
    const error = new Error('Test error')

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('rejects the promise', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.duration).toEqual(null)

      request.send()
      request.rejected(error)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.entry.reject).toHaveBeenCalledWith(error)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.duration).toEqual(expect.any(Number))
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not call reject more than once', () => {
      request.send()
      request.rejected(error)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => request.rejected(error)).toThrow(KafkaJSNonRetriableError)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.entry.reject).toHaveBeenCalledTimes(1)
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('instrumentation events', () => {
    let emitter: any, removeListener: any, eventCalled: any

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      eventCalled = jest.fn()
      emitter = new InstrumentationEventEmitter()
      request = request = createSocketRequest({
        send: sendRequest,
        timeout: timeoutHandler,
        instrumentationEmitter: emitter,
      })
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
    afterEach(() => {
      removeListener && removeListener()
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('emits NETWORK_REQUEST', () => {
      emitter.addListener(events.NETWORK_REQUEST, eventCalled)
      request.send()
      request.completed({ size, payload })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(eventCalled).toHaveBeenCalledWith({
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        id: expect.any(Number),
        type: 'network.request',
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        timestamp: expect.any(Number),
        payload: {
          apiKey: 0,
          apiName: 'Produce',
          apiVersion: 4,
          broker: 'localhost:9092',
          clientId: 'KafkaJS',
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          correlationId: expect.any(Number),
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          createdAt: expect.any(Number),
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          duration: expect.any(Number),
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          pendingDuration: expect.any(Number),
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          sentAt: expect.any(Number),
          size,
        },
      })
    })
  })
})
