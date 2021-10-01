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
const REQUEST_TIMED_OUT = 7

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
  describe('deleteTopics', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the topics array is invalid', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.deleteTopics({ topics: null })).rejects.toHaveProperty(
        'message',
        'Invalid topics array null'
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.deleteTopics({ topics: 'this-is-not-an-array' })).rejects.toHaveProperty(
        'message',
        'Invalid topics array this-is-not-an-array'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the topic name is not a valid string', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.deleteTopics({ topics: [123] })).rejects.toHaveProperty(
        'message',
        'Invalid topics array, the names must be a valid string'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('delete topics', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })

      await admin.connect()
      await admin.createTopics({ waitForLeaders: true, topics: [{ topic: topicName }] })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.deleteTopics({ topics: [topicName] })).resolves.toBe()
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('remove deleted topics from the cluster target group', async () => {
      const cluster = createCluster()
      admin = createAdmin({ cluster, logger: newLogger() })
      await admin.connect()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.getTopicMetadata({ topics: [topicName] })).resolves.toBeTruthy()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.targetTopics.size).toEqual(1)

      await admin.deleteTopics({ topics: [topicName] })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.getTopicMetadata()).resolves.toBeTruthy()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.targetTopics.size).toEqual(0)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('retries if the controller has moved', async () => {
      const cluster = createCluster()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const broker = { deleteTopics: jest.fn(() => true) }

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
      await expect(admin.deleteTopics({ topics: [topicName] })).resolves.toBe()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.refreshMetadata).toHaveBeenCalledTimes(3)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.findControllerBroker).toHaveBeenCalledTimes(2)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.deleteTopics).toHaveBeenCalledTimes(1)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('interrupts on REQUEST_TIMED_OUT', async () => {
      const cluster = createCluster()
      const broker = {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        deleteTopics: jest.fn(() => {
          throw new KafkaJSProtocolError(createErrorFromCode(REQUEST_TIMED_OUT))
        }),
      }

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const loggerInstance = { error: jest.fn() }
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const logger = { namespace: jest.fn(() => loggerInstance) }

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      cluster.refreshMetadata = jest.fn()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      cluster.findControllerBroker = jest.fn(() => broker)

      admin = createAdmin({ cluster, logger })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.deleteTopics({ topics: [topicName] })).rejects.toHaveProperty(
        'message',
        'The request timed out'
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.deleteTopics).toHaveBeenCalledTimes(1)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(
        loggerInstance.error
      ).toHaveBeenCalledWith(
        'Could not delete topics, check if "delete.topic.enable" is set to "true" (the default value is "false") or increase the timeout',
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        { error: 'The request timed out', retryCount: 0, retryTime: expect.any(Number) }
      )
    })
  })
})
