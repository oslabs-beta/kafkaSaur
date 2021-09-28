// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createAdmi... Remove this comment to see the full error message
const createAdmin = require('../index')
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSPro... Remove this comment to see the full error message
  KafkaJSProtocolError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSAgg... Remove this comment to see the full error message
  KafkaJSAggregateError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSCre... Remove this comment to see the full error message
  KafkaJSCreateTopicError,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../errors')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createErro... Remove this comment to see the full error message
const { createErrorFromCode } = require('../../protocol/error')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
const { secureRandom, createCluster, newLogger } = require('testHelpers')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NOT_CONTRO... Remove this comment to see the full error message
const NOT_CONTROLLER = 41
const TOPIC_ALREADY_EXISTS = 36
const INVALID_TOPIC_EXCEPTION = 17

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
  describe('createTopics', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the topics array is invalid', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.createTopics({ topics: null })).rejects.toHaveProperty(
        'message',
        'Invalid topics array null'
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.createTopics({ topics: 'this-is-not-an-array' })).rejects.toHaveProperty(
        'message',
        'Invalid topics array this-is-not-an-array'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the topic name is not a valid string', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.createTopics({ topics: [{ topic: 123 }] })).rejects.toHaveProperty(
        'message',
        'Invalid topics array, the topic names have to be a valid string'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if there are multiple entries for the same topic', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      const topics = [{ topic: 'topic-123' }, { topic: 'topic-123' }]
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.createTopics({ topics })).rejects.toHaveProperty(
        'message',
        'Invalid topics array, it cannot have multiple entries for the same topic'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('create the new topics and return true', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })

      await admin.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.createTopics({
          waitForLeaders: false,
          topics: [{ topic: topicName }],
        })
      ).resolves.toEqual(true)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('retries if the controller has moved', async () => {
      const cluster = createCluster()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const broker = { createTopics: jest.fn(() => true) }

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
        admin.createTopics({
          waitForLeaders: false,
          topics: [{ topic: topicName }],
        })
      ).resolves.toEqual(true)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.refreshMetadata).toHaveBeenCalledTimes(2)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.findControllerBroker).toHaveBeenCalledTimes(2)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.createTopics).toHaveBeenCalledTimes(1)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('ignore already created topics and return false', async () => {
      const cluster = createCluster()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const broker = { createTopics: jest.fn() }

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      cluster.refreshMetadata = jest.fn()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      cluster.findControllerBroker = jest.fn(() => broker)
      broker.createTopics.mockImplementationOnce(() => {
        throw new KafkaJSAggregateError('error', [
          new KafkaJSCreateTopicError(createErrorFromCode(TOPIC_ALREADY_EXISTS), topicName),
        ])
      })

      admin = createAdmin({ cluster, logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.createTopics({
          waitForLeaders: false,
          topics: [{ topic: topicName }],
        })
      ).resolves.toEqual(false)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.refreshMetadata).toHaveBeenCalledTimes(1)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.findControllerBroker).toHaveBeenCalledTimes(1)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.createTopics).toHaveBeenCalledTimes(1)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('query metadata if waitForLeaders is true', async () => {
      const topic2 = `test-topic-${secureRandom()}`
      const topic3 = `test-topic-${secureRandom()}`

      const cluster = createCluster()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const broker = { createTopics: jest.fn(), metadata: jest.fn(() => true) }

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      cluster.refreshMetadata = jest.fn()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      cluster.findControllerBroker = jest.fn(() => broker)

      broker.createTopics.mockImplementationOnce(() => true)
      admin = createAdmin({ cluster, logger: newLogger() })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.createTopics({
          waitForLeaders: true,
          topics: [{ topic: topicName }, { topic: topic2 }, { topic: topic3 }],
        })
      ).resolves.toEqual(true)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.metadata).toHaveBeenCalledTimes(1)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.metadata).toHaveBeenCalledWith([topicName, topic2, topic3])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('forward non ignorable errors with topic name metadata', async () => {
      const cluster = createCluster()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const broker = { createTopics: jest.fn(), metadata: jest.fn(() => true) }

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      cluster.refreshMetadata = jest.fn()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      cluster.findControllerBroker = jest.fn(() => broker)

      broker.createTopics.mockImplementationOnce(() => {
        throw new KafkaJSAggregateError('error', [
          new KafkaJSCreateTopicError(createErrorFromCode(INVALID_TOPIC_EXCEPTION), topicName),
        ])
      })
      admin = createAdmin({ cluster, logger: newLogger() })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.createTopics({
          waitForLeaders: true,
          topics: [{ topic: topicName }],
        })
      ).rejects.toBeInstanceOf(KafkaJSAggregateError)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.refreshMetadata).toHaveBeenCalledTimes(1)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.findControllerBroker).toHaveBeenCalledTimes(1)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.createTopics).toHaveBeenCalledTimes(1)
    })
  })
})
