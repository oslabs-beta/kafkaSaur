// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createAdmi... Remove this comment to see the full error message
const createAdmin = require('./index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Instrument... Remove this comment to see the full error message
const InstrumentationEventEmitter = require('../instrumentation/emitter')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
const { createCluster, newLogger, secureRandom } = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createRetr... Remove this comment to see the full error message
const createRetry = require('../retry')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Admin', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('gives access to its logger', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(
      createAdmin({
        cluster: createCluster(),
        logger: newLogger(),
      }).logger()
    ).toMatchSnapshot()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('emits connection events', async () => {
    const admin = createAdmin({
      cluster: createCluster(),
      logger: newLogger(),
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const connectListener = jest.fn().mockName('connect')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const disconnectListener = jest.fn().mockName('disconnect')
    admin.on(admin.events.CONNECT, connectListener)
    admin.on(admin.events.DISCONNECT, disconnectListener)

    await admin.connect()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connectListener).toHaveBeenCalled()

    await admin.disconnect()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(disconnectListener).toHaveBeenCalled()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('emits the request event', async () => {
    const emitter = new InstrumentationEventEmitter()
    const admin = createAdmin({
      cluster: createCluster({ instrumentationEmitter: emitter }),
      logger: newLogger(),
      instrumentationEmitter: emitter,
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const requestListener = jest.fn().mockName('request')
    admin.on(admin.events.REQUEST, requestListener)

    await admin.connect()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(requestListener).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'admin.network.request',
      payload: {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        apiKey: expect.any(Number),
        apiName: 'ApiVersions',
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        apiVersion: expect.any(Number),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        broker: expect.any(String),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        clientId: expect.any(String),
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
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        size: expect.any(Number),
      },
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('emits the request timeout event', async () => {
    const retrier = createRetry()
    const emitter = new InstrumentationEventEmitter()
    const cluster = createCluster({
      requestTimeout: 1,
      enforceRequestTimeout: true,
      instrumentationEmitter: emitter,
    })

    const admin = createAdmin({
      cluster,
      logger: newLogger(),
      instrumentationEmitter: emitter,
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const requestListener = jest.fn().mockName('request_timeout')
    admin.on(admin.events.REQUEST_TIMEOUT, requestListener)

    await admin.connect()

    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    await retrier(async () => {
      try {
        await admin.createTopics({
          waitForLeaders: false,
          topics: [{ topic: `test-topic-${secureRandom()}` }],
        })
      } catch (e) {
        if (e.name !== 'KafkaJSRequestTimeoutError') {
          throw e
        }
      }
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(requestListener).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'admin.network.request_timeout',
      payload: {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        apiKey: expect.any(Number),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        apiName: expect.any(String),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        apiVersion: expect.any(Number),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        broker: expect.any(String),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        clientId: expect.any(String),
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('emits the request queue size event', async () => {
    const emitter = new InstrumentationEventEmitter()
    const cluster = createCluster({
      instrumentationEmitter: emitter,
      maxInFlightRequests: 1,
    })

    const admin = createAdmin({
      cluster,
      logger: newLogger(),
      instrumentationEmitter: emitter,
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const requestListener = jest.fn().mockName('request_queue_size')
    admin.on(admin.events.REQUEST_QUEUE_SIZE, requestListener)

    await admin.connect()
    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all([
      admin.createTopics({
        waitForLeaders: false,
        topics: [{ topic: `test-topic-${secureRandom()}`, partitions: 8 }],
      }),
      admin.createTopics({
        waitForLeaders: false,
        topics: [{ topic: `test-topic-${secureRandom()}`, partitions: 8 }],
      }),
    ])

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(requestListener).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'admin.network.request_queue_size',
      payload: {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        broker: expect.any(String),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        clientId: expect.any(String),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        queueSize: expect.any(Number),
      },
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('on throws an error when provided with an invalid event name', () => {
    const admin = createAdmin({
      cluster: createCluster(),
      logger: newLogger(),
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(() => admin.on('NON_EXISTENT_EVENT', () => {})).toThrow(
      /Event name should be one of admin.events./
    )
  })
})
