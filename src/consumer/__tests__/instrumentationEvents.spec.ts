// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Instrument... Remove this comment to see the full error message
const InstrumentationEventEmitter = require('../../instrumentation/emitter')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createProd... Remove this comment to see the full error message
const createProducer = require('../../producer')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createCons... Remove this comment to see the full error message
const createConsumer = require('../index')

const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
  secureRandom,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
  createCluster,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTopi... Remove this comment to see the full error message
  createTopic,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createModP... Remove this comment to see the full error message
  createModPartitioner,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitFor'.
  waitFor,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForCon... Remove this comment to see the full error message
  waitForConsumerToJoinGroup,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer > Instrumentation Events', () => {
  let topicName: any, groupId: any, cluster: any, producer: any, consumer: any, consumer2: any, message: any, emitter: any

  const createTestConsumer = (opts = {}) =>
    createConsumer({
      cluster,
      groupId,
      logger: newLogger(),
      heartbeatInterval: 100,
      maxWaitTimeInMs: 500,
      maxBytesPerPartition: 180,
      rebalanceTimeout: 1000,
      instrumentationEmitter: emitter,
      ...opts,
    })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topicName = `test-topic-${secureRandom()}`
    groupId = `consumer-group-id-${secureRandom()}`

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName })

    emitter = new InstrumentationEventEmitter()
    cluster = createCluster({ instrumentationEmitter: emitter, metadataMaxAge: 50 })
    producer = createProducer({
      cluster,
      createPartitioner: createModPartitioner,
      logger: newLogger(),
    })

    message = { key: `key-${secureRandom()}`, value: `value-${secureRandom()}` }
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    consumer && (await consumer.disconnect())
    consumer2 && (await consumer2.disconnect())
    producer && (await producer.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('on throws an error when provided with an invalid event name', () => {
    consumer = createTestConsumer()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(() => consumer.on('NON_EXISTENT_EVENT', () => {})).toThrow(
      /Event name should be one of consumer.events./
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('emits heartbeat', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const onHeartbeat = jest.fn()
    let heartbeats = 0

    consumer = createTestConsumer({ heartbeatInterval: 0 })
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    consumer.on(consumer.events.HEARTBEAT, async (event: any) => {
      onHeartbeat(event)
      heartbeats++
    })

    await consumer.connect()
    await producer.connect()
    await consumer.subscribe({ topic: topicName, fromBeginning: true })

    await consumer.run({ eachMessage: () => true })
    await producer.send({ acks: 1, topic: topicName, messages: [message] })

    await waitFor(() => heartbeats > 0)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onHeartbeat).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'consumer.heartbeat',
      payload: {
        groupId,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        memberId: expect.any(String),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        groupGenerationId: expect.any(Number),
      },
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('emits commit offsets', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const onCommitOffsets = jest.fn()
    let commitOffsets = 0

    consumer = createTestConsumer()
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    consumer.on(consumer.events.COMMIT_OFFSETS, async (event: any) => {
      onCommitOffsets(event)
      commitOffsets++
    })

    await consumer.connect()
    await producer.connect()
    await consumer.subscribe({ topic: topicName, fromBeginning: true })
    await consumer.run({ eachMessage: () => true })
    await producer.send({ acks: 1, topic: topicName, messages: [message] })

    await waitFor(() => commitOffsets > 0)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onCommitOffsets).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'consumer.commit_offsets',
      payload: {
        groupId,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        memberId: expect.any(String),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        groupGenerationId: expect.any(Number),
        topics: [
          {
            topic: topicName,
            partitions: [
              {
                offset: '1',
                partition: '0',
              },
            ],
          },
        ],
      },
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('emits group join', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const onGroupJoin = jest.fn()
    let groupJoin = 0

    consumer = createTestConsumer()
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    consumer.on(consumer.events.GROUP_JOIN, async (event: any) => {
      onGroupJoin(event)
      groupJoin++
    })

    await consumer.connect()
    await consumer.subscribe({ topic: topicName, fromBeginning: true })

    await consumer.run({ eachMessage: () => true })

    await waitFor(() => groupJoin > 0)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onGroupJoin).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'consumer.group_join',
      payload: {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        duration: expect.any(Number),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        groupId: expect.any(String),
        isLeader: true,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        leaderId: expect.any(String),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        groupProtocol: expect.any(String),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        memberId: expect.any(String),
        memberAssignment: { [topicName]: [0] },
      },
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('emits fetch', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const onFetch = jest.fn()
    let fetch = 0

    consumer = createTestConsumer()
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    consumer.on(consumer.events.FETCH, async (event: any) => {
      onFetch(event)
      fetch++
    })

    await consumer.connect()
    await consumer.subscribe({ topic: topicName, fromBeginning: true })

    await consumer.run({ eachMessage: () => true })

    await waitFor(() => fetch > 0)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onFetch).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'consumer.fetch',
      payload: {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        numberOfBatches: expect.any(Number),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        duration: expect.any(Number),
      },
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('emits fetch start', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const onFetchStart = jest.fn()
    let fetch = 0

    consumer = createTestConsumer()
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    consumer.on(consumer.events.FETCH_START, async (event: any) => {
      onFetchStart(event)
      fetch++
    })

    await consumer.connect()
    await consumer.subscribe({ topic: topicName, fromBeginning: true })

    await consumer.run({ eachMessage: () => true })

    await waitFor(() => fetch > 0)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onFetchStart).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'consumer.fetch_start',
      payload: {},
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('emits start batch process', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const onStartBatchProcess = jest.fn()
    let startBatchProcess = 0

    consumer = createTestConsumer()
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    consumer.on(consumer.events.START_BATCH_PROCESS, async (event: any) => {
      onStartBatchProcess(event)
      startBatchProcess++
    })

    await consumer.connect()
    await producer.connect()
    await consumer.subscribe({ topic: topicName, fromBeginning: true })
    await consumer.run({ eachMessage: () => true })
    await producer.send({ acks: 1, topic: topicName, messages: [message] })

    await waitFor(() => startBatchProcess > 0)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onStartBatchProcess).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'consumer.start_batch_process',
      payload: {
        topic: topicName,
        partition: 0,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        highWatermark: expect.any(String),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        offsetLag: expect.any(String),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        offsetLagLow: expect.any(String),
        batchSize: 1,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        firstOffset: expect.any(String),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        lastOffset: expect.any(String),
      },
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('emits end batch process', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const onEndBatchProcess = jest.fn()
    let endBatchProcess = 0

    consumer = createTestConsumer()
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    consumer.on(consumer.events.END_BATCH_PROCESS, async (event: any) => {
      onEndBatchProcess(event)
      endBatchProcess++
    })

    await consumer.connect()
    await producer.connect()
    await consumer.subscribe({ topic: topicName, fromBeginning: true })
    await consumer.run({ eachMessage: () => true })
    await producer.send({ acks: 1, topic: topicName, messages: [message] })

    await waitFor(() => endBatchProcess > 0)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onEndBatchProcess).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'consumer.end_batch_process',
      payload: {
        topic: topicName,
        partition: 0,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        highWatermark: expect.any(String),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        offsetLag: expect.any(String),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        offsetLagLow: expect.any(String),
        batchSize: 1,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        firstOffset: expect.any(String),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        lastOffset: expect.any(String),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        duration: expect.any(Number),
      },
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('emits connection events', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const connectListener = jest.fn().mockName('connect')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const disconnectListener = jest.fn().mockName('disconnect')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const stopListener = jest.fn().mockName('stop')

    consumer = createTestConsumer()
    consumer.on(consumer.events.CONNECT, connectListener)
    consumer.on(consumer.events.DISCONNECT, disconnectListener)
    consumer.on(consumer.events.STOP, stopListener)

    await consumer.connect()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connectListener).toHaveBeenCalled()

    await consumer.run()

    await consumer.disconnect()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(stopListener).toHaveBeenCalled()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(disconnectListener).toHaveBeenCalled()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('emits crash events', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const crashListener = jest.fn()
    const error = new Error('💣')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const eachMessage = jest.fn().mockImplementationOnce(() => {
      throw error
    })

    consumer = createTestConsumer({ retry: { retries: 0 } })
    consumer.on(consumer.events.CRASH, crashListener)

    await consumer.connect()
    await consumer.subscribe({ topic: topicName, fromBeginning: true })
    await consumer.run({ eachMessage })

    await producer.connect()
    await producer.send({ acks: 1, topic: topicName, messages: [message] })

    await waitFor(() => crashListener.mock.calls.length > 0)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(crashListener).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'consumer.crash',
      payload: { error, groupId, restart: true },
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('emits crash events with restart=false', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const crashListener = jest.fn()
    const error = new Error('💣💥')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const eachMessage = jest.fn().mockImplementationOnce(() => {
      throw error
    })

    consumer = createTestConsumer({ retry: { retries: 0, restartOnFailure: async () => false } })
    consumer.on(consumer.events.CRASH, crashListener)

    await consumer.connect()
    await consumer.subscribe({ topic: topicName, fromBeginning: true })
    await consumer.run({ eachMessage })

    await producer.connect()
    await producer.send({ acks: 1, topic: topicName, messages: [message] })

    await waitFor(() => crashListener.mock.calls.length > 0)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(crashListener).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'consumer.crash',
      payload: { error, groupId, restart: false },
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('emits rebalancing', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const onRebalancing = jest.fn()

    const groupId = `consumer-group-id-${secureRandom()}`

    consumer = createTestConsumer({
      groupId,
      cluster: createCluster({
        instrumentationEmitter: new InstrumentationEventEmitter(),
        metadataMaxAge: 50,
      }),
    })

    consumer2 = createTestConsumer({
      groupId,
      cluster: createCluster({
        instrumentationEmitter: new InstrumentationEventEmitter(),
        metadataMaxAge: 50,
      }),
    })

    let memberId: any
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    consumer.on(consumer.events.GROUP_JOIN, async (event: any) => {
      memberId = memberId || event.payload.memberId
    })

    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    consumer.on(consumer.events.REBALANCING, async (event: any) => {
      onRebalancing(event)
    })

    await consumer.connect()
    await consumer.subscribe({ topic: topicName, fromBeginning: true })

    consumer.run({ eachMessage: () => true })

    await waitForConsumerToJoinGroup(consumer, { label: 'consumer1' })

    await consumer2.connect()
    await consumer2.subscribe({ topic: topicName, fromBeginning: true })

    consumer2.run({ eachMessage: () => true })

    await waitForConsumerToJoinGroup(consumer2, { label: 'consumer2' })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onRebalancing).toBeCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'consumer.rebalancing',
      payload: {
        groupId: groupId,
        memberId: memberId,
      },
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('emits request events', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const requestListener = jest.fn().mockName('request')

    consumer = createTestConsumer()
    consumer.on(consumer.events.REQUEST, requestListener)

    await consumer.connect()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(requestListener).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'consumer.network.request',
      payload: {
        apiKey: 18,
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('emits request timeout events', async () => {
    cluster = createCluster({
      instrumentationEmitter: emitter,
      requestTimeout: 1,
      enforceRequestTimeout: true,
    })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const requestListener = jest.fn().mockName('request_timeout')

    consumer = createTestConsumer({ cluster })
    consumer.on(consumer.events.REQUEST_TIMEOUT, requestListener)

    await consumer
      .connect()
      .then(() => consumer.run({ eachMessage: () => true }))
      .catch((e: any) => e)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(requestListener).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'consumer.network.request_timeout',
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

  /**
   * This test is too flaky, we need to think about a better way of testing this.
   * Skipping until we have a better plan
   */
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it.skip('emits request queue size events', async () => {
    const cluster = createCluster({
      instrumentationEmitter: emitter,
      maxInFlightRequests: 1,
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const requestListener = jest.fn().mockName('request_queue_size')

    consumer = createTestConsumer({ cluster })
    consumer.on(consumer.events.REQUEST_QUEUE_SIZE, requestListener)

    consumer2 = createTestConsumer({ cluster })
    consumer2.on(consumer2.events.REQUEST_QUEUE_SIZE, requestListener)

    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all([
      consumer
        .connect()
        .then(() => consumer.run({ eachMessage: () => true }))
        .catch((e: any) => e),
      consumer2
        .connect()
        .then(() => consumer.run({ eachMessage: () => true }))
        .catch((e: any) => e),
    ])

    // add more concurrent requests to make we increate the requests
    // on the queue
    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all([
      consumer.describeGroup(),
      consumer.describeGroup(),
      consumer.describeGroup(),
      consumer.describeGroup(),
      consumer2.describeGroup(),
      consumer2.describeGroup(),
      consumer2.describeGroup(),
      consumer2.describeGroup(),
    ])

    await consumer2.disconnect()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(requestListener).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'consumer.network.request_queue_size',
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('emits received unsubscribed topics events', async () => {
    const topicNames = [`test-topic-${secureRandom()}`, `test-topic-${secureRandom()}`]
    const otherTopic = `test-topic-${secureRandom()}`
    const groupId = `consumer-group-id-${secureRandom()}`

    for (const topicName of [...topicNames, otherTopic]) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicName, partitions: 2 })
    }

    // First consumer subscribes to topicNames
    consumer = createTestConsumer({
      groupId,
      cluster: createCluster({
        instrumentationEmitter: new InstrumentationEventEmitter(),
        metadataMaxAge: 50,
      }),
    })

    await consumer.connect()
    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all(
      topicNames.map(topicName => consumer.subscribe({ topic: topicName, fromBeginning: true }))
    )

    consumer.run({ eachMessage: () => {} })
    await waitForConsumerToJoinGroup(consumer, { label: 'consumer1' })

    // Second consumer re-uses group id but only subscribes to one of the topics
    consumer2 = createTestConsumer({
      groupId,
      cluster: createCluster({
        instrumentationEmitter: new InstrumentationEventEmitter(),
        metadataMaxAge: 50,
      }),
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const onReceivedUnsubscribedTopics = jest.fn()
    let receivedUnsubscribedTopics = 0
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    consumer2.on(consumer.events.RECEIVED_UNSUBSCRIBED_TOPICS, async (event: any) => {
      onReceivedUnsubscribedTopics(event)
      receivedUnsubscribedTopics++
    })

    await consumer2.connect()
    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all(
      [topicNames[1], otherTopic].map(topicName =>
        consumer2.subscribe({ topic: topicName, fromBeginning: true })
      )
    )

    consumer2.run({ eachMessage: () => {} })
    await waitForConsumerToJoinGroup(consumer2, { label: 'consumer2' })

    // Wait for rebalance to finish
    await waitFor(async () => {
      const { state, members } = await consumer.describeGroup()
      return state === 'Stable' && members.length === 2
    })

    await waitFor(() => receivedUnsubscribedTopics > 0)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onReceivedUnsubscribedTopics).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'consumer.received_unsubscribed_topics',
      payload: {
        groupId,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        generationId: expect.any(Number),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        memberId: expect.any(String),
        assignedTopics: topicNames,
        topicsSubscribed: [topicNames[1], otherTopic],
        topicsNotSubscribed: [topicNames[0]],
      },
    })
  })
})
