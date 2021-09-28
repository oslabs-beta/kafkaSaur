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
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForCon... Remove this comment to see the full error message
  waitForConsumerToJoinGroup,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'generateMe... Remove this comment to see the full error message
  generateMessages,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'testIfKafk... Remove this comment to see the full error message
  testIfKafkaAtLeast_0_11,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSNon... Remove this comment to see the full error message
const { KafkaJSNonRetriableError } = require('../../errors')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Admin', () => {
  let admin: any, cluster: any, groupId: any, logger: any, topicName: any, anotherTopicName: any, yetAnotherTopicName: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topicName = `test-topic-${secureRandom()}`
    anotherTopicName = `another-topic-${secureRandom()}`
    yetAnotherTopicName = `yet-another-topic-${secureRandom()}`
    groupId = `consumer-group-id-${secureRandom()}`

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName })

    logger = newLogger()
    cluster = createCluster()
    admin = createAdmin({ cluster, logger })

    await admin.connect()
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    admin && (await admin.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('fetchOffsets', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the groupId is invalid', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.fetchOffsets({ groupId: null })).rejects.toThrow(
        KafkaJSNonRetriableError,
        'Invalid groupId null'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the topics argument is not a valid list', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.fetchOffsets({ groupId: 'groupId', topics: topicName })).rejects.toThrow(
        KafkaJSNonRetriableError,
        'Expected topic or topics array to be set'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if both topic and topics are set', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.fetchOffsets({ groupId: 'groupId', topic: topicName, topics: [topicName] })
      ).rejects.toThrow(KafkaJSNonRetriableError, 'Either topic or topics must be set, not both')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('returns unresolved consumer group offsets', async () => {
      const offsets = await admin.fetchOffsets({
        groupId,
        topic: topicName,
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsets).toEqual([{ partition: 0, offset: '-1', metadata: null }])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('returns the current consumer group offset', async () => {
      await admin.setOffsets({
        groupId,
        topic: topicName,
        partitions: [{ partition: 0, offset: 13 }],
      })

      const offsets = await admin.fetchOffsets({
        groupId,
        topic: topicName,
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsets).toEqual([{ partition: 0, offset: '13', metadata: null }])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('returns consumer group offsets for all topics', async () => {
      await admin.setOffsets({
        groupId,
        topic: topicName,
        partitions: [{ partition: 0, offset: 13 }],
      })
      await admin.setOffsets({
        groupId,
        topic: anotherTopicName,
        partitions: [{ partition: 0, offset: 23 }],
      })
      await admin.setOffsets({
        groupId,
        topic: yetAnotherTopicName,
        partitions: [{ partition: 0, offset: 42 }],
      })

      const offsets = await admin.fetchOffsets({
        groupId,
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsets).toIncludeSameMembers([
        {
          topic: yetAnotherTopicName,
          partitions: [{ partition: 0, offset: '42', metadata: null }],
        },
        { topic: anotherTopicName, partitions: [{ partition: 0, offset: '23', metadata: null }] },
        { topic: topicName, partitions: [{ partition: 0, offset: '13', metadata: null }] },
      ])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('returns consumer group offsets for list of topics', async () => {
      await admin.setOffsets({
        groupId,
        topic: topicName,
        partitions: [{ partition: 0, offset: 13 }],
      })
      await admin.setOffsets({
        groupId,
        topic: anotherTopicName,
        partitions: [{ partition: 0, offset: 42 }],
      })

      const offsets = await admin.fetchOffsets({
        groupId,
        topics: [topicName, anotherTopicName],
      })

      // There's no guarantee for the order of topics so we compare sets to avoid flaky tests.
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsets).toIncludeSameMembers([
        { topic: anotherTopicName, partitions: [{ partition: 0, offset: '42', metadata: null }] },
        { topic: topicName, partitions: [{ partition: 0, offset: '13', metadata: null }] },
      ])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when used with the resolvedOffsets option', () => {
      let producer: any, consumer: any

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
      beforeEach(async (done: any) => {
        producer = createProducer({
          cluster,
          createPartitioner: createModPartitioner,
          logger,
        })
        await producer.connect()

        consumer = createConsumer({
          cluster,
          groupId,
          maxWaitTimeInMs: 100,
          logger,
        })

        await consumer.connect()
        await consumer.subscribe({ topic: topicName, fromBeginning: true })
        consumer.run({ eachMessage: () => {} })
        await waitForConsumerToJoinGroup(consumer)

        // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
        consumer.on(consumer.events.END_BATCH_PROCESS, async () => {
          // stop the consumer after the first batch, so only 5 are committed
          await consumer.stop()
          // send batch #2
          await producer.send({
            acks: 1,
            topic: topicName,
            messages: generateMessages({ number: 5 }),
          })
          done()
        })

        // send batch #1
        await producer.send({
          acks: 1,
          topic: topicName,
          messages: generateMessages({ number: 5 }),
        })
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
      afterEach(async () => {
        producer && (await producer.disconnect())
        consumer && (await consumer.disconnect())
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('no reset: returns latest *committed* consumer offsets', async () => {
        const offsetsBeforeResolving = await admin.fetchOffsets({
          groupId,
          topic: topicName,
        })
        const offsetsUponResolving = await admin.fetchOffsets({
          groupId,
          topic: topicName,
          resolveOffsets: true,
        })
        const offsetsAfterResolving = await admin.fetchOffsets({
          groupId,
          topic: topicName,
        })

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(offsetsBeforeResolving).toEqual([{ partition: 0, offset: '5', metadata: null }])
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(offsetsUponResolving).toEqual([{ partition: 0, offset: '5', metadata: null }])
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(offsetsAfterResolving).toEqual([{ partition: 0, offset: '5', metadata: null }])
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('reset to latest: returns latest *topic* offsets after resolving', async () => {
        await admin.resetOffsets({ groupId, topic: topicName })

        const offsetsBeforeResolving = await admin.fetchOffsets({
          groupId,
          topic: topicName,
        })
        const offsetsUponResolving = await admin.fetchOffsets({
          groupId,
          topic: topicName,
          resolveOffsets: true,
        })
        const offsetsAfterResolving = await admin.fetchOffsets({
          groupId,
          topic: topicName,
        })

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(offsetsBeforeResolving).toEqual([{ partition: 0, offset: '-1', metadata: null }])
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(offsetsUponResolving).toEqual([{ partition: 0, offset: '10', metadata: null }])
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(offsetsAfterResolving).toEqual([{ partition: 0, offset: '10', metadata: null }])
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('reset to earliest: returns earliest *topic* offsets after resolving', async () => {
        await admin.resetOffsets({ groupId, topic: topicName, earliest: true })

        const offsetsBeforeResolving = await admin.fetchOffsets({
          groupId,
          topic: topicName,
        })
        const offsetsUponResolving = await admin.fetchOffsets({
          groupId,
          topic: topicName,
          resolveOffsets: true,
        })
        const offsetsAfterResolving = await admin.fetchOffsets({
          groupId,
          topic: topicName,
        })

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(offsetsBeforeResolving).toEqual([{ partition: 0, offset: '-2', metadata: null }])
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(offsetsUponResolving).toEqual([{ partition: 0, offset: '0', metadata: null }])
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(offsetsAfterResolving).toEqual([{ partition: 0, offset: '0', metadata: null }])
      })

      testIfKafkaAtLeast_0_11(
        'will return the correct earliest offset when it is greater than 0',
        // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
        async () => {
          // simulate earliest offset = 7, by deleting first 7 messages from the topic
          const messagesToDelete = [
            {
              partition: 0,
              offset: '7',
            },
          ]

          await admin.deleteTopicRecords({ topic: topicName, partitions: messagesToDelete })
          await admin.resetOffsets({ groupId, topic: topicName, earliest: true })

          const offsetsBeforeResolving = await admin.fetchOffsets({
            groupId,
            topic: topicName,
          })
          const offsetsUponResolving = await admin.fetchOffsets({
            groupId,
            topic: topicName,
            resolveOffsets: true,
          })
          const offsetsAfterResolving = await admin.fetchOffsets({
            groupId,
            topic: topicName,
          })

          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(offsetsBeforeResolving).toEqual([{ partition: 0, offset: '-2', metadata: null }])
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(offsetsUponResolving).toEqual([{ partition: 0, offset: '7', metadata: null }])
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(offsetsAfterResolving).toEqual([{ partition: 0, offset: '7', metadata: null }])
        }
      )
    })
  })
})
