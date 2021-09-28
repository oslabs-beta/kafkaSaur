// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createAdmi... Remove this comment to see the full error message
const createAdmin = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createProd... Remove this comment to see the full error message
const createProducer = require('../../producer')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createCons... Remove this comment to see the full error message
const createConsumer = require('../../consumer')

const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
  secureRandom,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
  createCluster,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTopi... Remove this comment to see the full error message
  createTopic,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createModP... Remove this comment to see the full error message
  createModPartitioner,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitFor'.
  waitFor,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForCon... Remove this comment to see the full error message
  waitForConsumerToJoinGroup,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Admin', () => {
  let topicName: any, admin: any, producer: any, cluster: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topicName = `test-topic-${secureRandom()}`
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName })

    admin = createAdmin({ cluster, logger: newLogger() })

    cluster = createCluster()
    producer = createProducer({
      cluster,
      createPartitioner: createModPartitioner,
      logger: newLogger(),
    })
  })
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    admin && (await admin.disconnect())
    producer && (await producer.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('fetchTopicOffsetsByTimestamp', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the topic name is not a valid string', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.fetchTopicOffsetsByTimestamp(null)).rejects.toHaveProperty(
        'message',
        'Invalid topic null'
      )
    })

    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    const sendMessages = async (n: any) => {
      await admin.connect()
      await producer.connect()

      const messages = Array(n)
        // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
        .fill()
        .map(() => {
          const value = secureRandom()
          return { key: `key-${value}`, value: `value-${value}` }
        })

      await producer.send({ acks: 1, topic: topicName, messages })
    }

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('returns the offsets from timestamp', async () => {
      await sendMessages(10)
      const fromTimestamp = Date.now()
      await sendMessages(10)
      const futureTimestamp = Date.now()
      const offsetsFromTimestamp = await admin.fetchTopicOffsetsByTimestamp(
        topicName,
        fromTimestamp
      )
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsetsFromTimestamp).toEqual([{ partition: 0, offset: '10' }])
      const offsetsFutureTimestamp = await admin.fetchTopicOffsetsByTimestamp(
        topicName,
        futureTimestamp
      )
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsetsFutureTimestamp).toEqual([{ partition: 0, offset: '20' }])
      const groupId = `consumer-group-id-${secureRandom()}`
      const consumer = createConsumer({
        cluster,
        groupId,
        maxWaitTimeInMs: 1,
        maxBytesPerPartition: 180,
        logger: newLogger(),
      })
      await consumer.connect()
      await consumer.subscribe({ topic: topicName, fromBeginning: true })
      /** real timestamp in messages after `fromTimestamp` */
      let realTimestamp = 0
      consumer.run({
        // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
        eachMessage: async ({
          message
        }: any) => {
          if (message.timestamp < fromTimestamp) return
          if (realTimestamp === 0) realTimestamp = message.timestamp
          if (realTimestamp > 0) consumer.stop()
        },
      })
      await waitForConsumerToJoinGroup(consumer)
      await waitFor(() => realTimestamp > 0)
      const offsetsRealTimestamp = await admin.fetchTopicOffsetsByTimestamp(
        topicName,
        realTimestamp
      )
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsetsRealTimestamp).toEqual([{ partition: 0, offset: '10' }])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('returns the offsets from timestamp when no messages', async () => {
      const fromTimestamp = Date.now()
      const offsetsFromTimestamp = await admin.fetchTopicOffsetsByTimestamp(
        topicName,
        fromTimestamp
      )
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsetsFromTimestamp).toEqual([{ partition: 0, offset: '0' }])
      const offsets = await admin.fetchTopicOffsets(topicName)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsets).toEqual([{ partition: 0, offset: '0', low: '0', high: '0' }])
    })
  })
})
