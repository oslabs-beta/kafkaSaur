// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createAdmi... Remove this comment to see the full error message
const createAdmin = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createCons... Remove this comment to see the full error message
const createConsumer = require('../../consumer')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
const { secureRandom, createCluster, newLogger, createTopic } = require('testHelpers')

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
  describe('setOffsets', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the groupId is invalid', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.setOffsets({ groupId: null })).rejects.toHaveProperty(
        'message',
        'Invalid groupId null'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the topic name is not a valid string', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.setOffsets({ groupId: 'groupId', topic: null })).rejects.toHaveProperty(
        'message',
        'Invalid topic null'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if partitions is invalid', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.setOffsets({ groupId: 'groupId', topic: 'topic', partitions: null })
      ).rejects.toHaveProperty('message', 'Invalid partitions')

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.setOffsets({ groupId: 'groupId', topic: 'topic', partitions: [] })
      ).rejects.toHaveProperty('message', 'Invalid partitions')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('set the consumer group to any offsets', async () => {
      const cluster = createCluster()
      admin = createAdmin({ cluster, logger: newLogger() })

      await admin.connect()
      await admin.setOffsets({
        groupId,
        topic: topicName,
        partitions: [{ partition: 0, offset: 13 }],
      })

      const offsets = await admin.fetchOffsets({ groupId, topic: topicName })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsets).toEqual([{ partition: 0, offset: '13', metadata: null }])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the consumer group is running', async () => {
      consumer = createConsumer({ groupId, cluster: createCluster(), logger: newLogger() })
      await consumer.connect()
      await consumer.subscribe({ topic: topicName })
      await consumer.run({ eachMessage: () => true })

      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })

      await admin.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.setOffsets({
          groupId,
          topic: topicName,
          partitions: [{ partition: 0, offset: 13 }],
        })
      ).rejects.toHaveProperty(
        'message',
        'The consumer group must have no running instances, current state: Stable'
      )
    })
  })
})
