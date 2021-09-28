// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createAdmi... Remove this comment to see the full error message
const createAdmin = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSPro... Remove this comment to see the full error message
const { KafkaJSProtocolError } = require('../../errors')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createErro... Remove this comment to see the full error message
const { createErrorFromCode } = require('../../protocol/error')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
const { secureRandom, createCluster, newLogger } = require('testHelpers')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NOT_CONTRO... Remove this comment to see the full error message
const NOT_CONTROLLER = 41

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Admin', () => {
  let topicName: any, admin: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    topicName = `test-topic-${secureRandom()}`
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    admin && (await admin.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('createPartitions', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the topics array is invalid', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.createPartitions({ topicPartitions: null })).rejects.toHaveProperty(
        'message',
        'Invalid topic partitions array null'
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.createPartitions({ topicPartitions: 'this-is-not-an-array' })
      ).rejects.toHaveProperty('message', 'Invalid topic partitions array this-is-not-an-array')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the topic name is not a valid string', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.createPartitions({ topicPartitions: [{ topic: 123 }] })
      ).rejects.toHaveProperty(
        'message',
        'Invalid topic partitions array, the topic names have to be a valid string'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if there are multiple entries for the same topic', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      const topicPartitions = [{ topic: 'topic-123' }, { topic: 'topic-123' }]
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.createPartitions({ topicPartitions })).rejects.toHaveProperty(
        'message',
        'Invalid topic partitions array, it cannot have multiple entries for the same topic'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error trying to create partition if topic does not exists', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })

      await admin.connect()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.createPartitions({
          topicPartitions: [{ topic: topicName + 'x', count: 2 }],
        })
      ).rejects.toHaveProperty('message', 'This server does not host this topic-partition')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error trying to assign invalid broker', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })

      await admin.connect()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.createTopics({
          waitForLeaders: false,
          topics: [{ topic: topicName }],
        })
      ).resolves.toEqual(true)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.createPartitions({
          topicPartitions: [{ topic: topicName, count: 2, assignments: [[10]] }],
        })
      ).rejects.toHaveProperty('message', 'Replica assignment is invalid')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error trying when total partition is less then current', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })

      await admin.connect()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.createTopics({
          waitForLeaders: false,
          topics: [{ topic: topicName, numPartitions: 3 }],
        })
      ).resolves.toEqual(true)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.createPartitions({
          topicPartitions: [{ topic: topicName, count: 2 }],
        })
      ).rejects.toHaveProperty('message', 'Number of partitions is invalid')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('create new partition', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })

      await admin.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.createTopics({
          waitForLeaders: false,
          topics: [{ topic: topicName }],
        })
      ).resolves.toEqual(true)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.createPartitions({
          topicPartitions: [{ topic: topicName, count: 2 }],
        })
      ).resolves.not.toThrow()
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('retries if the controller has moved', async () => {
      const cluster = createCluster()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const broker = { createPartitions: jest.fn(() => true) }

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      cluster.refreshMetadata = jest.fn()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      cluster.findControllerBroker = jest
        .fn()
        .mockImplementationOnce(() => {
          throw new KafkaJSProtocolError(createErrorFromCode(NOT_CONTROLLER))
        })
        .mockImplementationOnce(() => broker)

      admin = createAdmin({ cluster, logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.createPartitions({
          topicPartitions: [{ topic: topicName, count: 2 }],
        })
      ).resolves.not.toThrow()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.refreshMetadata).toHaveBeenCalledTimes(2)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.findControllerBroker).toHaveBeenCalledTimes(2)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.createPartitions).toHaveBeenCalledTimes(1)
    })
  })
})
