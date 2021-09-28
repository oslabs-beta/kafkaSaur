let initProducerIdSpy: any
let sendOffsetsSpy: any
let retrySpy: any

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.mock('./eosManager', () => {
  return (...args: any[]) => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const eosManager = jest.requireActual('./eosManager')(...args)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    initProducerIdSpy = jest.spyOn(eosManager, 'initProducerId')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    sendOffsetsSpy = jest.spyOn(eosManager, 'sendOffsets')

    return eosManager
  };
})

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.mock('../retry', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
  const spy = jest.fn().mockImplementation(jest.requireActual('../retry'))
  retrySpy = spy
  return spy
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'uuid'.
const uuid = require('uuid/v4')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Instrument... Remove this comment to see the full error message
const InstrumentationEventEmitter = require('../instrumentation/emitter')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createProd... Remove this comment to see the full error message
const createProducer = require('./index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createCons... Remove this comment to see the full error message
const createConsumer = require('../consumer')
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
  secureRandom,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'connection... Remove this comment to see the full error message
  connectionOpts,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sslConnect... Remove this comment to see the full error message
  sslConnectionOpts,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'saslEntrie... Remove this comment to see the full error message
  saslEntries,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
  createCluster,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createModP... Remove this comment to see the full error message
  createModPartitioner,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sslBrokers... Remove this comment to see the full error message
  sslBrokers,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'saslBroker... Remove this comment to see the full error message
  saslBrokers,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'testIfKafk... Remove this comment to see the full error message
  testIfKafkaAtLeast_0_11,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTopi... Remove this comment to see the full error message
  createTopic,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForMes... Remove this comment to see the full error message
  waitForMessages,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createRetr... Remove this comment to see the full error message
const createRetrier = require('../retry')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSNon... Remove this comment to see the full error message
const { KafkaJSNonRetriableError } = require('../errors')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sleep'.
const sleep = require('../utils/sleep')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Producer', () => {
  let topicName: any, producer: any, consumer: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    topicName = `test-topic-${secureRandom()}`
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    producer && (await producer.disconnect())
    consumer && (await consumer.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('throws an error if the topic is invalid', async () => {
    producer = createProducer({ cluster: createCluster(), logger: newLogger() })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(producer.send({ acks: 1, topic: null })).rejects.toHaveProperty(
      'message',
      'Invalid topic'
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('throws an error if messages is invalid', async () => {
    producer = createProducer({ cluster: createCluster(), logger: newLogger() })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(
      producer.send({ acks: 1, topic: topicName, messages: null })
    ).rejects.toHaveProperty('message', `Invalid messages array [null] for topic "${topicName}"`)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('throws an error for messages with a value of undefined', async () => {
    producer = createProducer({ cluster: createCluster(), logger: newLogger() })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(
      producer.send({ acks: 1, topic: topicName, messages: [{ foo: 'bar' }] })
    ).rejects.toHaveProperty(
      'message',
      `Invalid message without value for topic "${topicName}": {"foo":"bar"}`
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('throws an error if the producer is not connected', async () => {
    producer = createProducer({ cluster: createCluster(), logger: newLogger() })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(
      producer.send({
        topic: topicName,
        messages: [{ key: 'key', value: 'value' }],
      })
    ).rejects.toThrow(/The producer is disconnected/)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('throws an error if the producer is disconnecting', async () => {
    const cluster = createCluster()
    const originalDisconnect = cluster.disconnect
    cluster.disconnect = async () => {
      await sleep(10)
      return originalDisconnect.apply(cluster)
    }

    producer = createProducer({ cluster, logger: newLogger() })
    await producer.connect()

    producer.disconnect() // slow disconnect should give a disconnecting status
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(
      producer.send({
        topic: topicName,
        messages: [{ key: 'key', value: 'value' }],
      })
    ).rejects.toThrow(/The producer is disconnecting/)
    cluster.disconnect = originalDisconnect
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('allows messages with a null value to support tombstones', async () => {
    producer = createProducer({ cluster: createCluster(), logger: newLogger() })
    await producer.connect()
    await producer.send({ acks: 1, topic: topicName, messages: [{ foo: 'bar', value: null }] })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('support SSL connections', async () => {
    const cluster = createCluster(sslConnectionOpts(), sslBrokers())
    producer = createProducer({ cluster, logger: newLogger() })
    await producer.connect()
  })

  for (const e of saslEntries) {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test(`support SASL ${e.name} connections`, async () => {
      const cluster = createCluster(e.opts(), saslBrokers())
      producer = createProducer({ cluster, logger: newLogger() })
      await producer.connect()
    })

    if (e.wrongOpts) {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test(`throws an error if SASL ${e.name} fails to authenticate`, async () => {
        const cluster = createCluster(e.wrongOpts(), saslBrokers())

        producer = createProducer({ cluster, logger: newLogger() })
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(producer.connect()).rejects.toThrow(e.expectedErr)
      })
    }
  }

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('reconnects the cluster if disconnected', async () => {
    const cluster = createCluster({
      createPartitioner: createModPartitioner,
    })

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName })

    producer = createProducer({ cluster, logger: newLogger() })
    await producer.connect()
    await producer.send({
      acks: 1,
      topic: topicName,
      messages: [{ key: '1', value: '1' }],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.isConnected()).toEqual(true)
    await cluster.disconnect()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.isConnected()).toEqual(false)

    await producer.send({
      acks: 1,
      topic: topicName,
      messages: [{ key: '2', value: '2' }],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.isConnected()).toEqual(true)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('gives access to its logger', () => {
    producer = createProducer({ cluster: createCluster(), logger: newLogger() })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(producer.logger()).toMatchSnapshot()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('on throws an error when provided with an invalid event name', () => {
    producer = createProducer({ cluster: createCluster(), logger: newLogger() })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(() => producer.on('NON_EXISTENT_EVENT', () => {})).toThrow(
      /Event name should be one of producer.events./
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('emits connection events', async () => {
    producer = createProducer({ cluster: createCluster(), logger: newLogger() })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const connectListener = jest.fn().mockName('connect')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const disconnectListener = jest.fn().mockName('disconnect')
    producer.on(producer.events.CONNECT, connectListener)
    producer.on(producer.events.DISCONNECT, disconnectListener)

    await producer.connect()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connectListener).toHaveBeenCalled()

    await producer.disconnect()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(disconnectListener).toHaveBeenCalled()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('emits the request event', async () => {
    const emitter = new InstrumentationEventEmitter()
    producer = createProducer({
      logger: newLogger(),
      cluster: createCluster({ instrumentationEmitter: emitter }),
      instrumentationEmitter: emitter,
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const requestListener = jest.fn().mockName('request')
    producer.on(producer.events.REQUEST, requestListener)

    await producer.connect()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(requestListener).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'producer.network.request',
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
    const emitter = new InstrumentationEventEmitter()
    const cluster = createCluster({
      requestTimeout: 1,
      enforceRequestTimeout: true,
      instrumentationEmitter: emitter,
    })

    producer = createProducer({
      cluster,
      logger: newLogger(),
      instrumentationEmitter: emitter,
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const requestListener = jest.fn().mockName('request_timeout')
    producer.on(producer.events.REQUEST_TIMEOUT, requestListener)

    await producer
      .connect()
      .then(() =>
        producer.send({
          acks: -1,
          topic: topicName,
          messages: [{ key: 'key-0', value: 'value-0' }],
        })
      )
      .catch((e: any) => e)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(requestListener).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'producer.network.request_timeout',
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
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName, partitions: 8 })

    const emitter = new InstrumentationEventEmitter()
    const cluster = createCluster({
      instrumentationEmitter: emitter,
      maxInFlightRequests: 1,
      clientId: 'test-client-id11111',
    })

    producer = createProducer({
      cluster,
      logger: newLogger(),
      instrumentationEmitter: emitter,
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const requestListener = jest.fn().mockName('request_queue_size')
    producer.on(producer.events.REQUEST_QUEUE_SIZE, requestListener)

    await producer.connect()
    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all([
      producer.send({
        acks: -1,
        topic: topicName,
        messages: [
          { partition: 0, value: 'value-0' },
          { partition: 1, value: 'value-1' },
          { partition: 2, value: 'value-2' },
        ],
      }),
      producer.send({
        acks: -1,
        topic: topicName,
        messages: [
          { partition: 0, value: 'value-0' },
          { partition: 1, value: 'value-1' },
          { partition: 2, value: 'value-2' },
        ],
      }),
    ])

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(requestListener).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'producer.network.request_queue_size',
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when acks=0', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns immediately', async () => {
      const cluster = createCluster({
        ...connectionOpts(),
        createPartitioner: createModPartitioner,
      })

      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicName })

      producer = createProducer({ cluster, logger: newLogger() })
      await producer.connect()

      const sendMessages = async () =>
        await producer.send({
          acks: 0,
          topic: topicName,
          // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
          messages: new Array(10).fill().map((_, i) => ({
            key: `key-${i}`,
            value: `value-${i}`
          })),
        })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(await sendMessages()).toEqual([])
    })
  })

  function testProduceMessages(idempotent = false) {
    const acks = idempotent ? -1 : 1

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('produce messages', async () => {
      const cluster = createCluster({
        createPartitioner: createModPartitioner,
      })

      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicName })

      producer = createProducer({ cluster, logger: newLogger(), idempotent })
      await producer.connect()

      const sendMessages = async () =>
        await producer.send({
          acks,
          topic: topicName,
          // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
          messages: new Array(10).fill().map((_, i) => ({
            key: `key-${i}`,
            value: `value-${i}`
          })),
        })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(await sendMessages()).toEqual([
        {
          baseOffset: '0',
          topicName,
          errorCode: 0,
          partition: 0,
          logAppendTime: '-1',
          logStartOffset: '0',
        },
      ])

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(await sendMessages()).toEqual([
        {
          baseOffset: '10',
          topicName,
          errorCode: 0,
          partition: 0,
          logAppendTime: '-1',
          logStartOffset: '0',
        },
      ])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('it should allow sending an empty list of messages', async () => {
      const cluster = createCluster({
        createPartitioner: createModPartitioner,
      })

      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicName })

      producer = createProducer({ cluster, logger: newLogger(), idempotent })
      await producer.connect()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(producer.send({ acks, topic: topicName, messages: [] })).toResolve()
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('produce messages to multiple topics', async () => {
      const topics = [`test-topic-${secureRandom()}`, `test-topic-${secureRandom()}`]

      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topics[0] })
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topics[1] })

      const cluster = createCluster({
        ...connectionOpts(),
        createPartitioner: createModPartitioner,
      })
      const byTopicName = (a: any, b: any) => a.topicName.localeCompare(b.topicName)

      producer = createProducer({ cluster, logger: newLogger(), idempotent })
      await producer.connect()

      const sendBatch = async (topics: any) => {
        const topicMessages = topics.map((topic: any) => ({
          acks,
          topic,

          // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
          messages: new Array(10).fill().map((_, i) => ({
            key: `key-${i}`,
            value: `value-${i}`
          }))
        }))

        return producer.sendBatch({
          acks,
          topicMessages,
        })
      }

      let result = await sendBatch(topics)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(result.sort(byTopicName)).toEqual(
        [
          {
            baseOffset: '0',
            topicName: topics[0],
            errorCode: 0,
            partition: 0,
            logStartOffset: '0',
            logAppendTime: '-1',
          },
          {
            topicName: topics[1],
            errorCode: 0,
            baseOffset: '0',
            partition: 0,
            logStartOffset: '0',
            logAppendTime: '-1',
          },
        ].sort(byTopicName)
      )

      result = await sendBatch(topics)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(result.sort(byTopicName)).toEqual(
        [
          {
            topicName: topics[0],
            errorCode: 0,
            baseOffset: '10',
            partition: 0,
            logAppendTime: '-1',
            logStartOffset: '0',
          },
          {
            topicName: topics[1],
            errorCode: 0,
            baseOffset: '10',
            partition: 0,
            logAppendTime: '-1',
            logStartOffset: '0',
          },
        ].sort(byTopicName)
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('sendBatch should allow sending an empty list of topicMessages', async () => {
      const cluster = createCluster({
        createPartitioner: createModPartitioner,
      })

      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicName })

      producer = createProducer({ cluster, logger: newLogger(), idempotent })
      await producer.connect()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(producer.sendBatch({ acks, topicMessages: [] })).toResolve()
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('sendBatch should consolidate topicMessages by topic', async () => {
      const cluster = createCluster({
        createPartitioner: createModPartitioner,
      })

      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicName, partitions: 1 })

      const messagesConsumed: any = []
      consumer = createConsumer({
        groupId: `test-consumer-${uuid()}`,
        cluster: createCluster(),
        logger: newLogger(),
      })
      await consumer.connect()
      await consumer.subscribe({ topic: topicName, fromBeginning: true })
      await consumer.run({
        // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
        eachMessage: async (event: any) => {
          messagesConsumed.push(event)
        },
      })

      producer = createProducer({ cluster, logger: newLogger(), idempotent })
      await producer.connect()

      const topicMessages = [
        {
          topic: topicName,
          messages: [
            { key: 'key-1', value: 'value-1' },
            { key: 'key-2', value: 'value-2' },
          ],
        },
        {
          topic: topicName,
          messages: [{ key: 'key-3', value: 'value-3' }],
        },
      ]

      const result = await producer.sendBatch({
        acks,
        topicMessages,
      })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(result).toEqual([
        {
          topicName,
          errorCode: 0,
          baseOffset: '0',
          partition: 0,
          logAppendTime: '-1',
          logStartOffset: '0',
        },
      ])

      await waitForMessages(messagesConsumed, { number: 3 })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(waitForMessages(messagesConsumed, { number: 3 })).resolves.toEqual([
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.objectContaining({
          topic: topicName,
          partition: 0,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          message: expect.objectContaining({
            // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
            key: Buffer.from('key-1'),
            // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
            value: Buffer.from('value-1'),
            offset: '0',
          }),
        }),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.objectContaining({
          topic: topicName,
          partition: 0,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          message: expect.objectContaining({
            // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
            key: Buffer.from('key-2'),
            // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
            value: Buffer.from('value-2'),
            offset: '1',
          }),
        }),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.objectContaining({
          topic: topicName,
          partition: 0,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          message: expect.objectContaining({
            // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
            key: Buffer.from('key-3'),
            // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
            value: Buffer.from('value-3'),
            offset: '2',
          }),
        }),
      ])
    })

    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    testIfKafkaAtLeast_0_11('produce messages for Kafka 0.11', async () => {
      const cluster = createCluster({
        createPartitioner: createModPartitioner,
      })

      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicName })

      producer = createProducer({ cluster, logger: newLogger(), idempotent })
      await producer.connect()

      const sendMessages = async () =>
        await producer.send({
          acks,
          topic: topicName,
          // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
          messages: new Array(10).fill().map((_, i) => ({
            key: `key-${i}`,
            value: `value-${i}`
          })),
        })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(await sendMessages()).toEqual([
        {
          topicName,
          baseOffset: '0',
          errorCode: 0,
          logAppendTime: '-1',
          logStartOffset: '0',
          partition: 0,
        },
      ])

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(await sendMessages()).toEqual([
        {
          topicName,
          baseOffset: '10',
          errorCode: 0,
          logAppendTime: '-1',
          logStartOffset: '0',
          partition: 0,
        },
      ])
    })

    testIfKafkaAtLeast_0_11(
      'produce messages for Kafka 0.11 without specifying message key',
      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      async () => {
        const cluster = createCluster({
          createPartitioner: createModPartitioner,
        })

        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        await createTopic({ topic: topicName })

        producer = createProducer({ cluster, logger: newLogger(), idempotent })
        await producer.connect()

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(
          producer.send({
            acks,
            topic: topicName,
            messages: [
              {
                value: 'test-value',
              },
            ],
          })
        ).toResolve()
      }
    )

    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    testIfKafkaAtLeast_0_11('produce messages for Kafka 0.11 with headers', async () => {
      const cluster = createCluster({
        createPartitioner: createModPartitioner,
      })

      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicName })

      producer = createProducer({ cluster, logger: newLogger(), idempotent })
      await producer.connect()

      const sendMessages = async () =>
        await producer.send({
          acks,
          topic: topicName,
          // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
          messages: new Array(10).fill().map((_, i) => ({
            key: `key-${i}`,
            value: `value-${i}`,

            headers: {
              [`header-a${i}`]: `header-value-a${i}`,
              [`header-b${i}`]: `header-value-b${i}`,
              [`header-c${i}`]: `header-value-c${i}`,
            }
          })),
        })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(await sendMessages()).toEqual([
        {
          topicName,
          baseOffset: '0',
          errorCode: 0,
          logAppendTime: '-1',
          logStartOffset: '0',
          partition: 0,
        },
      ])

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(await sendMessages()).toEqual([
        {
          topicName,
          baseOffset: '10',
          errorCode: 0,
          logAppendTime: '-1',
          logStartOffset: '0',
          partition: 0,
        },
      ])
    })
  }

  testProduceMessages(false)

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when idempotent=true', () => {
    testProduceMessages(true)

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if sending a message with acks != -1', async () => {
      const cluster = createCluster({
        createPartitioner: createModPartitioner,
      })

      producer = createProducer({ cluster, logger: newLogger(), idempotent: true })
      await producer.connect()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        producer.send({
          acks: 1,
          topic: topicName,
          // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
          messages: new Array(10).fill().map((_, i) => ({
            key: `key-${i}`,
            value: `value-${i}`
          })),
        })
      ).rejects.toEqual(
        new KafkaJSNonRetriableError(
          "Not requiring ack for all messages invalidates the idempotent producer's EoS guarantees"
        )
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        producer.send({
          acks: 0,
          topic: topicName,
          // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
          messages: new Array(10).fill().map((_, i) => ({
            key: `key-${i}`,
            value: `value-${i}`
          })),
        })
      ).rejects.toEqual(
        new KafkaJSNonRetriableError(
          "Not requiring ack for all messages invalidates the idempotent producer's EoS guarantees"
        )
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('sets the default retry value to MAX_SAFE_INTEGER', async () => {
      const cluster = createCluster({
        createPartitioner: createModPartitioner,
      })

      producer = createProducer({ cluster, logger: newLogger(), idempotent: true })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(retrySpy).toHaveBeenCalledWith({ retries: (Number as any).MAX_SAFE_INTEGER });
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if retries < 1', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() =>
        createProducer({
          cluster: {},
          logger: newLogger(),
          idempotent: true,
          retry: { retries: 0 },
        })
      ).toThrowError(
        new KafkaJSNonRetriableError(
          'Idempotent producer must allow retries to protect against transient errors'
        )
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('only calls initProducerId if unitialized', async () => {
      const cluster = createCluster({
        createPartitioner: createModPartitioner,
      })

      producer = createProducer({ cluster, logger: newLogger(), idempotent: true })

      await producer.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(initProducerIdSpy).toHaveBeenCalledTimes(1)

      initProducerIdSpy.mockClear()
      await producer.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(initProducerIdSpy).toHaveBeenCalledTimes(0)
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('transactions', () => {
    let transactionalId: any

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      transactionalId = `transactional-id-${secureRandom()}`
    })

    const testTransactionEnd = (shouldCommit = true) => {
      const endFn = shouldCommit ? 'commit' : 'abort'
      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      testIfKafkaAtLeast_0_11(`transaction flow ${endFn}`, async () => {
        const cluster = createCluster({
          createPartitioner: createModPartitioner,
        })

        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        await createTopic({ topic: topicName })

        producer = createProducer({
          cluster,
          logger: newLogger(),
          transactionalId,
        })

        await producer.connect()
        const txn = await producer.transaction()
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(producer.transaction()).rejects.toEqual(
          new KafkaJSNonRetriableError(
            'There is already an ongoing transaction for this producer. Please end the transaction before beginning another.'
          )
        )

        await txn.send({
          topic: topicName,
          messages: [{ key: '2', value: '2' }],
        })
        await txn.sendBatch({
          topicMessages: [
            {
              topic: topicName,
              messages: [{ key: '2', value: '2' }],
            },
          ],
        })

        await txn[endFn]() // Dynamic
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(txn.send()).rejects.toEqual(
          new KafkaJSNonRetriableError('Cannot continue to use transaction once ended')
        )
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(txn.sendBatch()).rejects.toEqual(
          new KafkaJSNonRetriableError('Cannot continue to use transaction once ended')
        )
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(txn.commit()).rejects.toEqual(
          new KafkaJSNonRetriableError('Cannot continue to use transaction once ended')
        )
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(txn.abort()).rejects.toEqual(
          new KafkaJSNonRetriableError('Cannot continue to use transaction once ended')
        )

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(await producer.transaction()).toBeTruthy() // Can create another transaction
      })
    }

    testTransactionEnd(true)
    testTransactionEnd(false)

    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    testIfKafkaAtLeast_0_11('allows sending messages outside a transaction', async () => {
      const cluster = createCluster({
        createPartitioner: createModPartitioner,
      })

      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicName })

      producer = createProducer({
        cluster,
        logger: newLogger(),
        transactionalId,
      })

      await producer.connect()
      await producer.transaction()

      await producer.send({
        topic: topicName,
        messages: [
          {
            key: 'key',
            value: 'value',
          },
        ],
      })
      await producer.sendBatch({
        topicMessages: [
          {
            topic: topicName,
            messages: [
              {
                key: 'key',
                value: 'value',
              },
            ],
          },
        ],
      })
    })

    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    testIfKafkaAtLeast_0_11('supports sending offsets', async () => {
      const cluster = createCluster()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const markOffsetAsCommittedSpy = jest.spyOn(cluster, 'markOffsetAsCommitted')

      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicName, partitions: 2 })

      producer = createProducer({
        cluster,
        logger: newLogger(),
        transactionalId,
      })

      await producer.connect()

      const consumerGroupId = `consumer-group-id-${secureRandom()}`
      const topics = [
        {
          topic: topicName,
          partitions: [
            {
              partition: 0,
              offset: '5',
            },
            {
              partition: 1,
              offset: '10',
            },
          ],
        },
      ]
      const txn = await producer.transaction()
      await txn.sendOffsets({ consumerGroupId, topics })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(sendOffsetsSpy).toHaveBeenCalledWith({
        consumerGroupId,
        topics,
      })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(markOffsetAsCommittedSpy).toHaveBeenCalledTimes(2)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(markOffsetAsCommittedSpy.mock.calls[0][0]).toEqual({
        groupId: consumerGroupId,
        topic: topicName,
        partition: 0,
        offset: '5',
      })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(markOffsetAsCommittedSpy.mock.calls[1][0]).toEqual({
        groupId: consumerGroupId,
        topic: topicName,
        partition: 1,
        offset: '10',
      })

      await txn.commit()

      const coordinator = await cluster.findGroupCoordinator({ groupId: consumerGroupId })
      const retry = createRetrier({ retries: 5 })

      // There is a potential delay between transaction commit and offset
      // commits propagating to all replicas - retry expecting initial failure.
      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      await retry(async () => {
        const { responses: consumerOffsets } = await coordinator.offsetFetch({
          groupId: consumerGroupId,
          topics,
        })

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(consumerOffsets).toEqual([
          {
            topic: topicName,
            partitions: [
              // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
              expect.objectContaining({
                offset: '5',
                partition: 0,
              }),
              // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
              expect.objectContaining({
                offset: '10',
                partition: 1,
              }),
            ],
          },
        ])
      })
    })
  })
})
