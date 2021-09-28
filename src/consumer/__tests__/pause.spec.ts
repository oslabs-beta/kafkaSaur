// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createProd... Remove this comment to see the full error message
const createProducer = require('../../producer')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createCons... Remove this comment to see the full error message
const createConsumer = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSNon... Remove this comment to see the full error message
const { KafkaJSNonRetriableError } = require('../../errors')

const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
  secureRandom,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
  createCluster,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTopi... Remove this comment to see the full error message
  createTopic,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForMes... Remove this comment to see the full error message
  waitForMessages,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForCon... Remove this comment to see the full error message
  waitForConsumerToJoinGroup,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer', () => {
  let groupId: any, producer: any, consumer: any, topics: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topics = [`test-topic-${secureRandom()}`, `test-topic-${secureRandom()}`]
    groupId = `consumer-group-id-${secureRandom()}`

    for (const topic of topics) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic, partitions: 2 })
    }

    const producerCluster = createCluster()
    producer = createProducer({
      cluster: producerCluster,
      logger: newLogger(),
    })

    const consumerCluster = createCluster()
    consumer = createConsumer({
      cluster: consumerCluster,
      groupId,
      maxWaitTimeInMs: 1,
      maxBytesPerPartition: 180,
      logger: newLogger(),
    })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    consumer && (await consumer.disconnect())
    producer && (await producer.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#paused', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns an empty array if consumer#run has not been called', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumer.paused()).toEqual([])
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when pausing', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error if the topic is invalid', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => consumer.pause([{ topic: null, partitions: [0] }])).toThrow(
        KafkaJSNonRetriableError,
        'Invalid topic null'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error if Consumer#run has not been called', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => consumer.pause([{ topic: 'foo', partitions: [0] }])).toThrow(
        KafkaJSNonRetriableError,
        'Consumer group was not initialized, consumer#run must be called first'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not fetch messages for the paused topic', async () => {
      await consumer.connect()
      await producer.connect()

      const key1 = secureRandom()
      const message1 = { key: `key-${key1}`, value: `value-${key1}`, partition: 0 }
      const key2 = secureRandom()
      const message2 = { key: `key-${key2}`, value: `value-${key2}`, partition: 1 }

      for (const topic of topics) {
        await producer.send({ acks: 1, topic, messages: [message1] })
        await consumer.subscribe({ topic, fromBeginning: true })
      }

      const messagesConsumed: any = []
      consumer.run({ eachMessage: async (event: any) => messagesConsumed.push(event) })

      await waitForConsumerToJoinGroup(consumer)
      await waitForMessages(messagesConsumed, { number: 2 })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumer.paused()).toEqual([])
      const [pausedTopic, activeTopic] = topics
      consumer.pause([{ topic: pausedTopic }])

      for (const topic of topics) {
        await producer.send({ acks: 1, topic, messages: [message2] })
      }

      const consumedMessages = await waitForMessages(messagesConsumed, { number: 3 })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumedMessages.filter(({
        topic
      }: any) => topic === pausedTopic)).toEqual([
        {
          topic: pausedTopic,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          partition: expect.any(Number),
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          message: expect.objectContaining({ offset: '0' }),
        },
      ])

      const byPartition = (a: any, b: any) => a.partition - b.partition
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(
        consumedMessages.filter(({
          topic
        }: any) => topic === activeTopic).sort(byPartition)
      ).toEqual([
        {
          topic: activeTopic,
          partition: 0,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          message: expect.objectContaining({ offset: '0' }),
        },
        {
          topic: activeTopic,
          partition: 1,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          message: expect.objectContaining({ offset: '0' }),
        },
      ])

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumer.paused()).toEqual([
        {
          topic: pausedTopic,
          partitions: [0, 1],
        },
      ])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not fetch messages for the paused partitions', async () => {
      await consumer.connect()
      await producer.connect()

      const [topic] = topics
      const partitions = [0, 1]

      const messages = Array(1)
        // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
        .fill()
        .map(() => {
          const value = secureRandom()
          return { key: `key-${value}`, value: `value-${value}` }
        })
      const forPartition = (partition: any) => (message: any) => ({
        ...message,
        partition
      })

      for (const partition of partitions) {
        await producer.send({ acks: 1, topic, messages: messages.map(forPartition(partition)) })
      }
      await consumer.subscribe({ topic, fromBeginning: true })

      const messagesConsumed: any = []
      consumer.run({ eachMessage: async (event: any) => messagesConsumed.push(event) })

      await waitForConsumerToJoinGroup(consumer)
      await waitForMessages(messagesConsumed, { number: messages.length * partitions.length })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumer.paused()).toEqual([])
      const [pausedPartition, activePartition] = partitions
      consumer.pause([{ topic, partitions: [pausedPartition] }])

      for (const partition of partitions) {
        await producer.send({ acks: 1, topic, messages: messages.map(forPartition(partition)) })
      }

      const consumedMessages = await waitForMessages(messagesConsumed, {
        number: messages.length * 3,
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumedMessages.filter(({
        partition
      }: any) => partition === pausedPartition)).toEqual(
        // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'message' implicitly has an 'any' type.
        messages.map((message, i) => ({
          topic,
          partition: pausedPartition,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          message: expect.objectContaining({ offset: `${i}` })
        }))
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumedMessages.filter(({
        partition
      }: any) => partition !== pausedPartition)).toEqual(
        // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'message' implicitly has an 'any' type.
        messages.concat(messages).map((message, i) => ({
          topic,
          partition: activePartition,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          message: expect.objectContaining({ offset: `${i}` })
        }))
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumer.paused()).toEqual([
        {
          topic,
          partitions: [pausedPartition],
        },
      ])
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when all topics are paused', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not fetch messages and wait maxWaitTimeInMs per attempt', async () => {
      const consumerCluster = createCluster()
      consumer = createConsumer({
        cluster: consumerCluster,
        groupId,
        maxWaitTimeInMs: 100,
        maxBytesPerPartition: 180,
        logger: newLogger(),
      })

      await producer.connect()
      await consumer.connect()

      const [topic1, topic2] = topics
      await consumer.subscribe({ topic: topic1, fromBeginning: true })
      await consumer.subscribe({ topic: topic2, fromBeginning: true })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const eachMessage = jest.fn()
      consumer.run({ eachMessage })
      await waitForConsumerToJoinGroup(consumer)

      consumer.pause([{ topic: topic1 }, { topic: topic2 }])

      const key1 = secureRandom()
      const message1 = { key: `key-${key1}`, value: `value-${key1}`, partition: 0 }

      await producer.send({ acks: 1, topic: topic1, messages: [message1] })
      await producer.send({ acks: 1, topic: topic2, messages: [message1] })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(eachMessage).not.toHaveBeenCalled()
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when resuming', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error if the topic is invalid', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => consumer.pause([{ topic: null, partitions: [0] }])).toThrow(
        KafkaJSNonRetriableError,
        'Invalid topic null'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error if Consumer#run has not been called', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => consumer.pause([{ topic: 'foo', partitions: [0] }])).toThrow(
        KafkaJSNonRetriableError,
        'Consumer group was not initialized, consumer#run must be called first'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('resumes fetching from the specified topic', async () => {
      await consumer.connect()
      await producer.connect()

      const key = secureRandom()
      const message = { key: `key-${key}`, value: `value-${key}`, partition: 0 }

      for (const topic of topics) {
        await consumer.subscribe({ topic, fromBeginning: true })
      }

      const messagesConsumed: any = []
      consumer.run({ eachMessage: async (event: any) => messagesConsumed.push(event) })

      const [pausedTopic, activeTopic] = topics
      consumer.pause([{ topic: pausedTopic }])

      await waitForConsumerToJoinGroup(consumer)

      for (const topic of topics) {
        await producer.send({ acks: 1, topic, messages: [message] })
      }

      await waitForMessages(messagesConsumed, { number: 1 })

      consumer.resume([{ topic: pausedTopic }])

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(waitForMessages(messagesConsumed, { number: 2 })).resolves.toEqual([
        {
          topic: activeTopic,
          partition: 0,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          message: expect.objectContaining({ offset: '0' }),
        },
        {
          topic: pausedTopic,
          partition: 0,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          message: expect.objectContaining({ offset: '0' }),
        },
      ])

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumer.paused()).toEqual([])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('resumes fetching from earlier paused partitions', async () => {
      await consumer.connect()
      await producer.connect()

      const [topic] = topics
      const partitions = [0, 1]

      const messages = Array(1)
        // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
        .fill()
        .map(() => {
          const value = secureRandom()
          return { key: `key-${value}`, value: `value-${value}` }
        })
      const forPartition = (partition: any) => (message: any) => ({
        ...message,
        partition
      })

      for (const partition of partitions) {
        await producer.send({ acks: 1, topic, messages: messages.map(forPartition(partition)) })
      }
      await consumer.subscribe({ topic, fromBeginning: true })

      const messagesConsumed: any = []
      consumer.run({ eachMessage: async (event: any) => messagesConsumed.push(event) })

      await waitForConsumerToJoinGroup(consumer)
      await waitForMessages(messagesConsumed, { number: messages.length * partitions.length })

      const [pausedPartition, activePartition] = partitions
      consumer.pause([{ topic, partitions: [pausedPartition] }])

      for (const partition of partitions) {
        await producer.send({ acks: 1, topic, messages: messages.map(forPartition(partition)) })
      }

      await waitForMessages(messagesConsumed, {
        number: messages.length * 3,
      })

      consumer.resume([{ topic, partitions: [pausedPartition] }])

      const consumedMessages = await waitForMessages(messagesConsumed, {
        number: messages.length * 4,
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumedMessages.filter(({
        partition
      }: any) => partition === pausedPartition)).toEqual(
        // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'message' implicitly has an 'any' type.
        messages.concat(messages).map((message, i) => ({
          topic,
          partition: pausedPartition,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          message: expect.objectContaining({ offset: `${i}` })
        }))
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumedMessages.filter(({
        partition
      }: any) => partition !== pausedPartition)).toEqual(
        // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'message' implicitly has an 'any' type.
        messages.concat(messages).map((message, i) => ({
          topic,
          partition: activePartition,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          message: expect.objectContaining({ offset: `${i}` })
        }))
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumer.paused()).toEqual([])
    })
  })
})
