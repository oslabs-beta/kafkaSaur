// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createAdmi... Remove this comment to see the full error message
const createAdmin = require('../index')
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
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForCon... Remove this comment to see the full error message
  waitForConsumerToJoinGroup,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Admin', () => {
  let topicName: any, groupId: any, admin: any, consumer: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topicName = `test-topic-${secureRandom()}`
    groupId = `consumer-group-id-${secureRandom()}`

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    admin && (await admin.disconnect())
    consumer && (await consumer.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('resetOffsets', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the groupId is invalid', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.resetOffsets({ groupId: null })).rejects.toHaveProperty(
        'message',
        'Invalid groupId null'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the topic name is not a valid string', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.resetOffsets({ groupId: 'groupId', topic: null })).rejects.toHaveProperty(
        'message',
        'Invalid topic null'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('set the consumer group offsets to the latest offsets', async () => {
      const cluster = createCluster()
      admin = createAdmin({ cluster, logger: newLogger() })

      await admin.connect()
      await admin.setOffsets({
        groupId,
        topic: topicName,
        partitions: [{ partition: 0, offset: 13 }],
      })

      await admin.resetOffsets({
        groupId,
        topic: topicName,
      })

      const offsets = await admin.fetchOffsets({
        groupId,
        topic: topicName,
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsets).toEqual([{ partition: 0, offset: '-1', metadata: null }])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('set the consumer group offsets to the earliest offsets', async () => {
      const cluster = createCluster()
      admin = createAdmin({ cluster, logger: newLogger() })

      await admin.connect()
      await admin.setOffsets({
        groupId,
        topic: topicName,
        partitions: [{ partition: 0, offset: 13 }],
      })

      await admin.resetOffsets({
        groupId,
        topic: topicName,
        earliest: true,
      })

      const offsets = await admin.fetchOffsets({
        groupId,
        topic: topicName,
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsets).toEqual([{ partition: 0, offset: '-2', metadata: null }])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the consumer group is running', async () => {
      consumer = createConsumer({ groupId, cluster: createCluster(), logger: newLogger() })
      await consumer.connect()
      await consumer.subscribe({ topic: topicName })
      consumer.run({ eachMessage: () => true })
      await waitForConsumerToJoinGroup(consumer)

      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })

      await admin.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.resetOffsets({
          groupId,
          topic: topicName,
        })
      ).rejects.toHaveProperty(
        'message',
        'The consumer group must have no running instances, current state: Stable'
      )
    })
  })
})
