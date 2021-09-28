// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createAdmi... Remove this comment to see the full error message
const createAdmin = require('../../admin')
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
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createModP... Remove this comment to see the full error message
  createModPartitioner,
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
  let topicName: any, groupId: any, cluster: any, producer: any, consumer: any

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
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    consumer && (await consumer.disconnect())
    producer && (await producer.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when seek offset', () => {
    let admin: any

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      admin = createAdmin({ logger: newLogger(), cluster })
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
    afterEach(async () => {
      admin && (await admin.disconnect())
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error if the topic is invalid', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => consumer.seek({ topic: null })).toThrow(
        KafkaJSNonRetriableError,
        'Invalid topic null'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error if the partition is not a number', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => consumer.seek({ topic: topicName, partition: 'ABC' })).toThrow(
        KafkaJSNonRetriableError,
        'Invalid partition, expected a number received ABC'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error if the offset is not a number', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => consumer.seek({ topic: topicName, partition: 0, offset: 'ABC' })).toThrow(
        KafkaJSNonRetriableError,
        'Invalid offset, expected a long received ABC'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error if the offset is negative and not a special offset', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => consumer.seek({ topic: topicName, partition: 0, offset: '-32' })).toThrow(
        KafkaJSNonRetriableError,
        'Offset must not be a negative number'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error if called before consumer run', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => consumer.seek({ topic: topicName, partition: 0, offset: '1' })).toThrow(
        KafkaJSNonRetriableError,
        'Consumer group was not initialized, consumer#run must be called first'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates the partition offset to the given offset', async () => {
      await consumer.connect()
      await producer.connect()

      const key1 = secureRandom()
      const message1 = { key: `key-${key1}`, value: `value-${key1}` }
      const key2 = secureRandom()
      const message2 = { key: `key-${key2}`, value: `value-${key2}` }
      const key3 = secureRandom()
      const message3 = { key: `key-${key3}`, value: `value-${key3}` }

      await producer.send({ acks: 1, topic: topicName, messages: [message1, message2, message3] })
      await consumer.subscribe({ topic: topicName, fromBeginning: true })

      const messagesConsumed: any = []
      // must be called after run because the ConsumerGroup must be initialized
      consumer.run({ eachMessage: async (event: any) => messagesConsumed.push(event) })
      consumer.seek({ topic: topicName, partition: 0, offset: 1 })

      await waitForConsumerToJoinGroup(consumer)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(waitForMessages(messagesConsumed, { number: 2 })).resolves.toEqual([
        {
          topic: topicName,
          partition: 0,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          message: expect.objectContaining({ offset: '1' }),
        },
        {
          topic: topicName,
          partition: 0,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          message: expect.objectContaining({ offset: '2' }),
        },
      ])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('uses the last seek for a given topic/partition', async () => {
      await consumer.connect()
      await producer.connect()

      const key1 = secureRandom()
      const message1 = { key: `key-${key1}`, value: `value-${key1}` }
      const key2 = secureRandom()
      const message2 = { key: `key-${key2}`, value: `value-${key2}` }
      const key3 = secureRandom()
      const message3 = { key: `key-${key3}`, value: `value-${key3}` }

      await producer.send({ acks: 1, topic: topicName, messages: [message1, message2, message3] })
      await consumer.subscribe({ topic: topicName, fromBeginning: true })

      const messagesConsumed: any = []
      consumer.run({ eachMessage: async (event: any) => messagesConsumed.push(event) })
      consumer.seek({ topic: topicName, partition: 0, offset: 0 })
      consumer.seek({ topic: topicName, partition: 0, offset: 1 })
      consumer.seek({ topic: topicName, partition: 0, offset: 2 })

      await waitForConsumerToJoinGroup(consumer)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(waitForMessages(messagesConsumed, { number: 1 })).resolves.toEqual([
        {
          topic: topicName,
          partition: 0,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          message: expect.objectContaining({ offset: '2' }),
        },
      ])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('recovers from offset out of range', async () => {
      await consumer.connect()
      await producer.connect()

      const key1 = secureRandom()
      const message1 = { key: `key-${key1}`, value: `value-${key1}` }

      await producer.send({ acks: 1, topic: topicName, messages: [message1] })
      await consumer.subscribe({ topic: topicName, fromBeginning: true })

      const messagesConsumed: any = []
      consumer.run({ eachMessage: async (event: any) => messagesConsumed.push(event) })
      consumer.seek({ topic: topicName, partition: 0, offset: 100 })

      await waitForConsumerToJoinGroup(consumer)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(waitForMessages(messagesConsumed, { number: 1 })).resolves.toEqual([
        {
          topic: topicName,
          partition: 0,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          message: expect.objectContaining({ offset: '0' }),
        },
      ])

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.fetchOffsets({ groupId, topic: topicName })).resolves.toEqual([
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.objectContaining({
          partition: 0,
          offset: '1',
        }),
      ])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('When "autoCommit" is false', () => {
      let admin: any

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
      beforeEach(() => {
        admin = createAdmin({ logger: newLogger(), cluster })
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
      afterEach(async () => {
        admin && (await admin.disconnect())
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not commit the offset', async () => {
        // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
        await Promise.all([consumer, producer, admin].map(client => client.connect()))

        await producer.send({
          acks: 1,
          topic: topicName,
          messages: [1, 2, 3].map(n => ({ key: `key-${n}`, value: `value-${n}` })),
        })
        await consumer.subscribe({ topic: topicName, fromBeginning: true })

        let messagesConsumed: any = []
        consumer.run({
          autoCommit: false,
          eachMessage: async (event: any) => messagesConsumed.push(event),
        })
        consumer.seek({ topic: topicName, partition: 0, offset: 2 })

        await waitForConsumerToJoinGroup(consumer)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(waitForMessages(messagesConsumed, { number: 1 })).resolves.toEqual([
          {
            topic: topicName,
            partition: 0,
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            message: expect.objectContaining({ offset: '2' }),
          },
        ])

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(admin.fetchOffsets({ groupId, topic: topicName })).resolves.toEqual([
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect.objectContaining({
            partition: 0,
            offset: '-1',
          }),
        ])

        messagesConsumed = []
        consumer.seek({ topic: topicName, partition: 0, offset: 1 })

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(waitForMessages(messagesConsumed, { number: 2 })).resolves.toEqual([
          {
            topic: topicName,
            partition: 0,
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            message: expect.objectContaining({ offset: '1' }),
          },
          {
            topic: topicName,
            partition: 0,
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            message: expect.objectContaining({ offset: '2' }),
          },
        ])
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('recovers from offset out of range', async () => {
        await consumer.connect()
        await producer.connect()

        const key1 = secureRandom()
        const message1 = { key: `key-${key1}`, value: `value-${key1}` }

        await producer.send({ acks: 1, topic: topicName, messages: [message1] })
        await consumer.subscribe({ topic: topicName, fromBeginning: true })

        const messagesConsumed: any = []
        consumer.run({
          autoCommit: false,
          eachMessage: async (event: any) => messagesConsumed.push(event),
        })
        consumer.seek({ topic: topicName, partition: 0, offset: 100 })

        await waitForConsumerToJoinGroup(consumer)

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(waitForMessages(messagesConsumed, { number: 1 })).resolves.toEqual([
          {
            topic: topicName,
            partition: 0,
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            message: expect.objectContaining({ offset: '0' }),
          },
        ])

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(admin.fetchOffsets({ groupId, topic: topicName })).resolves.toEqual([
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect.objectContaining({
            partition: 0,
            offset: '-1',
          }),
        ])
      })
    })
  })
})
