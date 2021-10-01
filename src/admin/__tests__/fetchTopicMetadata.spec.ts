// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createAdmi... Remove this comment to see the full error message
const createAdmin = require('../index')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
const { secureRandom, createCluster, newLogger, createTopic } = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Admin', () => {
  let existingTopicName: any, numPartitions: any, admin: any, consumer: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    existingTopicName = `test-topic-${secureRandom()}`
    numPartitions = 4

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: existingTopicName, partitions: numPartitions })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    admin && (await admin.disconnect())
    consumer && (await consumer.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('fetchTopicMetadata', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the topic name is not a valid string', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.fetchTopicMetadata({ topics: [null] })).rejects.toHaveProperty(
        'message',
        'Invalid topic null'
      )
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.fetchTopicMetadata({ topics: [0] })).rejects.toHaveProperty(
        'message',
        'Invalid topic 0'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('retrieves metadata for each partition in the topic', async () => {
      const cluster = createCluster()
      admin = createAdmin({ cluster, logger: newLogger() })

      await admin.connect()
      const { topics: topicsMetadata } = await admin.fetchTopicMetadata({
        topics: [existingTopicName],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(topicsMetadata).toHaveLength(1)
      const topicMetadata = topicsMetadata[0]
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(topicMetadata).toHaveProperty('name', existingTopicName)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(topicMetadata.partitions).toHaveLength(numPartitions)

      topicMetadata.partitions.forEach((partition: any) => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(partition).toHaveProperty('partitionId')
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(partition).toHaveProperty('leader')
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(partition).toHaveProperty('replicas')
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(partition).toHaveProperty('partitionErrorCode')
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(partition).toHaveProperty('isr')
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('by default retrieves metadata for all topics', async () => {
      const cluster = createCluster()
      admin = createAdmin({ cluster, logger: newLogger() })

      await admin.connect()
      const { topics } = await admin.fetchTopicMetadata()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(topics.length).toBeGreaterThanOrEqual(1)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('creates a new topic if the topic does not exist and "allowAutoTopicCreation" is true', async () => {
      admin = createAdmin({
        cluster: createCluster({ allowAutoTopicCreation: true }),
        logger: newLogger(),
      })
      const newTopicName = `test-topic-${secureRandom()}`

      await admin.connect()
      const { topics: topicsMetadata } = await admin.fetchTopicMetadata({
        topics: [existingTopicName, newTopicName],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(topicsMetadata).toHaveLength(2)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(topicsMetadata).toEqual(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.arrayContaining([
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect.objectContaining({
            name: existingTopicName,
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            partitions: expect.any(Array),
          }),
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect.objectContaining({
            name: newTopicName,
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            partitions: expect.any(Array),
          }),
        ])
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the topic does not exist and "allowAutoTopicCreation" is false', async () => {
      admin = createAdmin({
        cluster: createCluster({ allowAutoTopicCreation: false }),
        logger: newLogger(),
      })
      const newTopicName = `test-topic-${secureRandom()}`

      await admin.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.fetchTopicMetadata({
          topics: [existingTopicName, newTopicName],
        })
      ).rejects.toHaveProperty('message', 'This server does not host this topic-partition')
    })
  })
})
