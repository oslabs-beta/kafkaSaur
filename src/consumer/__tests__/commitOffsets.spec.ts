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
  describe('when commitOffsets', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error if any of the topics is invalid', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumer.commitOffsets([{ topic: null }])).rejects.toThrow(
        KafkaJSNonRetriableError,
        'Invalid topic null'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error if anyof the partitions is not a number', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumer.commitOffsets([{ topic: topicName, partition: 'ABC' }])).rejects.toThrow(
        KafkaJSNonRetriableError,
        'Invalid partition, expected a number received ABC'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error if any of the offsets is not a number', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(
        consumer.commitOffsets([{ topic: topicName, partition: 0, offset: 'ABC' }])
      ).rejects.toThrow(KafkaJSNonRetriableError, 'Invalid offset, expected a long received ABC')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error if any of the offsets is not an absolute offset', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(
        consumer.commitOffsets([{ topic: topicName, partition: 0, offset: '-1' }])
      ).rejects.toThrow(KafkaJSNonRetriableError, 'Offset must not be a negative number')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error if called before consumer run', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(
        consumer.commitOffsets([{ topic: topicName, partition: 0, offset: '1' }])
      ).rejects.toThrow(
        KafkaJSNonRetriableError,
        'Consumer group was not initialized, consumer#run must be called first'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates the partition committed offset to the given offset', async () => {
      await consumer.connect()
      await producer.connect()

      const messages = Array(3)
        // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
        .fill()
        .map(() => {
          const value = secureRandom()
          return { key: `key-${value}`, value: `value-${value}` }
        })

      await producer.send({ acks: 1, topic: topicName, messages })

      const offsetsConsumed: any = []

      await consumer.subscribe({ topic: topicName, fromBeginning: true })
      consumer.run({
        autoCommit: false,
        // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
        eachMessage: async (event: any) => {
          offsetsConsumed.push(event.message.offset)
          if (offsetsConsumed.length === 1) {
            await consumer.commitOffsets([{ topic: topicName, partition: 0, offset: '1' }])
          }
        },
      })

      await waitForConsumerToJoinGroup(consumer)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(waitForMessages(offsetsConsumed, { number: 3 })).resolves.toEqual([
        '0',
        '1',
        '2',
      ])

      await waitForMessages(offsetsConsumed, { number: 3 })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.committedOffsets({ groupId })[topicName][0].toString()).toEqual('1')
    })
  })
})
