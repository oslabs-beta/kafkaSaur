const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
  secureRandom,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
  createCluster,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTopi... Remove this comment to see the full error message
  createTopic,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForMes... Remove this comment to see the full error message
  waitForMessages,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createModP... Remove this comment to see the full error message
  createModPartitioner,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForCon... Remove this comment to see the full error message
  waitForConsumerToJoinGroup,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createCons... Remove this comment to see the full error message
const createConsumer = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createProd... Remove this comment to see the full error message
const createProducer = require('../../producer')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer', () => {
  let groupId, cluster, consumer: any, producer: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    groupId = `consumer-group-id-${secureRandom()}`

    cluster = createCluster()
    consumer = createConsumer({
      cluster,
      groupId,
      maxWaitTimeInMs: 1,
      maxBytesPerPartition: 180,
      logger: newLogger(),
    })

    producer = createProducer({
      cluster: createCluster(),
      createPartitioner: createModPartitioner,
      logger: newLogger(),
    })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    consumer && (await consumer.disconnect())
    producer && (await producer.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when subscribe', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error if the topic is invalid', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(consumer.subscribe({ topic: null })).rejects.toHaveProperty(
        'message',
        'Invalid topic null'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error if the topic is not a String or RegExp', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(consumer.subscribe({ topic: 1 })).rejects.toHaveProperty(
        'message',
        'Invalid topic 1 (number), the topic name has to be a String or a RegExp'
      )
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('with regex', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('subscribes to all matching topics', async () => {
      const testScope = secureRandom()
      const topicUS = `pattern-${testScope}-us-${secureRandom()}`
      const topicSE = `pattern-${testScope}-se-${secureRandom()}`
      const topicUK = `pattern-${testScope}-uk-${secureRandom()}`
      const topicBR = `pattern-${testScope}-br-${secureRandom()}`

      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicUS })
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicSE })
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicUK })
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicBR })

      const messagesConsumed: any = []
      await consumer.connect()
      await consumer.subscribe({
        topic: new RegExp(`pattern-${testScope}-(se|br)-.*`, 'i'),
        fromBeginning: true,
      })

      consumer.run({ eachMessage: async (event: any) => messagesConsumed.push(event) })
      await waitForConsumerToJoinGroup(consumer)

      await producer.connect()
      await producer.sendBatch({
        acks: 1,
        topicMessages: [
          { topic: topicUS, messages: [{ key: `key-us`, value: `value-us` }] },
          { topic: topicUK, messages: [{ key: `key-uk`, value: `value-uk` }] },
          { topic: topicSE, messages: [{ key: `key-se`, value: `value-se` }] },
          { topic: topicBR, messages: [{ key: `key-br`, value: `value-br` }] },
        ],
      })

      await waitForMessages(messagesConsumed, { number: 2 })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(messagesConsumed.map(m => m.message.value.toString()).sort()).toEqual([
        'value-br',
        'value-se',
      ])
    })
  })
})
