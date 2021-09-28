// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createProd... Remove this comment to see the full error message
const createProducer = require('../../producer')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createCons... Remove this comment to see the full error message
const createConsumer = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MemberMeta... Remove this comment to see the full error message
const { MemberMetadata, MemberAssignment } = require('../../consumer/assignerProtocol')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSErr... Remove this comment to see the full error message
const { KafkaJSError, KafkaJSNumberOfRetriesExceeded } = require('../../errors')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sleep'.
const sleep = require('../../utils/sleep')
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
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForMes... Remove this comment to see the full error message
  waitForMessages,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForCon... Remove this comment to see the full error message
  waitForConsumerToJoinGroup,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer', () => {
  let topicName: any, groupId: any, cluster: any, producer: any, consumer: any, consumer2: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topicName = `test-topic-${secureRandom()}`
    groupId = `consumer-group-id-${secureRandom()}`

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName })

    cluster = createCluster()
    producer = createProducer({
      cluster,
      createPartitioner: createModPartitioner,
      logger: newLogger(),
    })

    consumer = createConsumer({
      cluster,
      groupId,
      logger: newLogger(),
    })

    await producer.connect()
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    consumer && (await consumer.disconnect())
    consumer2 && (await consumer2.disconnect())
    producer && (await producer.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('recovers from offset out of range', async () => {
    await consumer.connect()
    await producer.connect()

    const coordinator = await cluster.findGroupCoordinator({ groupId })
    const { generationId, memberId } = await coordinator.joinGroup({
      groupId,
      sessionTimeout: 6000,
      groupProtocols: [
        {
          name: 'AssignerName',
          metadata: MemberMetadata.encode({ version: 1, topics: [topicName] }),
        },
      ],
    })

    const memberAssignment = MemberAssignment.encode({
      version: 1,
      assignment: { [topicName]: [0] },
    })

    const groupAssignment = [{ memberId, memberAssignment }]
    await coordinator.syncGroup({
      groupId,
      generationId,
      memberId,
      groupAssignment,
    })

    const topics = [
      {
        topic: topicName,
        partitions: [{ partition: 0, offset: '11' }],
      },
    ]

    await coordinator.offsetCommit({
      groupId,
      groupGenerationId: generationId,
      memberId,
      topics,
    })

    await coordinator.leaveGroup({ groupId, memberId })

    const key1 = secureRandom()
    const message1 = { key: `key-${key1}`, value: `value-${key1}` }
    await producer.send({ acks: 1, topic: topicName, messages: [message1] })

    await consumer.subscribe({ topic: topicName, fromBeginning: true })

    const messagesConsumed: any = []
    consumer.run({ eachMessage: async (event: any) => messagesConsumed.push(event) })
    await waitForConsumerToJoinGroup(consumer)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(waitForMessages(messagesConsumed)).resolves.toEqual([
      {
        topic: topicName,
        partition: 0,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        message: expect.objectContaining({
          // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
          key: Buffer.from(message1.key),
          // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
          value: Buffer.from(message1.value),
          offset: '0',
        }),
      },
    ])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('recovers from crashes due to retriable errors', async () => {
    const groupId = `consumer-group-id-${secureRandom()}`
    consumer2 = createConsumer({
      cluster,
      groupId,
      logger: newLogger(),
      heartbeatInterval: 100,
      maxWaitTimeInMs: 1,
      maxBytesPerPartition: 180,
      retry: {
        retries: 0,
      },
    })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const crashListener = jest.fn()
    consumer2.on(consumer.events.CRASH, crashListener)

    const error = new KafkaJSError(new Error('💣'), { retriable: true })

    await consumer2.connect()
    await consumer2.subscribe({ topic: topicName, fromBeginning: true })

    const coordinator = await cluster.findGroupCoordinator({ groupId })
    const original = coordinator.joinGroup
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    coordinator.joinGroup = async () => {
      coordinator.joinGroup = original
      throw error
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const eachMessage = jest.fn()
    await consumer2.run({ eachMessage })

    const key = secureRandom()
    const message = { key: `key-${key}`, value: `value-${key}` }
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

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(waitFor(() => eachMessage.mock.calls.length)).resolves.toBe(1)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('recovers from retriable failures when "restartOnFailure" returns true', async () => {
    const errorMessage = '💣'
    let receivedErrorMessage
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const restartOnFailure = jest
      .fn()
      .mockImplementationOnce(async (e: any) => {
        receivedErrorMessage = e.message
        return true
      })
      .mockImplementationOnce(async () => false)

    consumer = createConsumer({
      cluster,
      groupId,
      logger: newLogger(),
      heartbeatInterval: 100,
      maxWaitTimeInMs: 1,
      maxBytesPerPartition: 180,
      retry: {
        retries: 0,
        initialRetryTime: 10,
        restartOnFailure,
      },
    })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const crashListener = jest.fn()
    consumer.on(consumer.events.CRASH, crashListener)

    await consumer.connect()
    await consumer.subscribe({ topic: topicName, fromBeginning: true })

    const runOpts = {
      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      eachMessage: async () => {
        throw new Error(errorMessage)
      },
    }
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.spyOn(runOpts, 'eachMessage')
    await consumer.run(runOpts)

    const key = secureRandom()
    const message = { key: `key-${key}`, value: `value-${key}` }
    await producer.send({ acks: 1, topic: topicName, messages: [message] })

    await waitFor(() => crashListener.mock.calls.length > 0)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(crashListener).toHaveBeenCalledWith({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      id: expect.any(Number),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      timestamp: expect.any(Number),
      type: 'consumer.crash',
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      payload: { groupId, error: expect.any(KafkaJSError), restart: true },
    })

    await waitFor(() => restartOnFailure.mock.calls.length > 0)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(restartOnFailure).toHaveBeenCalledWith(expect.any(KafkaJSNumberOfRetriesExceeded))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(receivedErrorMessage).toEqual(errorMessage)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(waitFor(() => (runOpts.eachMessage as any).mock.calls.length)).resolves.toBeGreaterThanOrEqual(1);
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('allows the user to bail out of restarting on retriable errors', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const connectListener = jest.fn()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const restartOnFailure = jest.fn(async () => {
      consumer.on(consumer.events.CONNECT, connectListener)
      return false
    })
    const initialRetryTime = 1
    consumer = createConsumer({
      cluster,
      groupId,
      logger: newLogger(),
      heartbeatInterval: 100,
      maxWaitTimeInMs: 1,
      maxBytesPerPartition: 180,
      retry: {
        retries: 0,
        initialRetryTime,
        restartOnFailure,
      },
    })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const crashListener = jest.fn()
    consumer.on(consumer.events.CRASH, crashListener)

    const error = new KafkaJSError(new Error('💣'), { retriable: true })

    await consumer.connect()
    await consumer.subscribe({ topic: topicName, fromBeginning: true })

    const coordinator = await cluster.findGroupCoordinator({ groupId })
    const original = coordinator.joinGroup
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    coordinator.joinGroup = async () => {
      coordinator.joinGroup = original
      throw error
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const eachMessage = jest.fn()
    await consumer.run({ eachMessage })

    const key = secureRandom()
    const message = { key: `key-${key}`, value: `value-${key}` }
    await producer.send({ acks: 1, topic: topicName, messages: [message] })

    await waitFor(() => restartOnFailure.mock.calls.length > 0)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(restartOnFailure).toHaveBeenCalledWith(error)

    // Very nasty, but it lets us assert that the consumer isn't restarting
    await sleep(initialRetryTime + 10)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connectListener).not.toHaveBeenCalled()
  })
})
