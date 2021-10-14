// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createAdmi... Remove this comment to see the full error message
const createAdmin = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSPro... Remove this comment to see the full error message
const { KafkaJSProtocolError } = require('../../errors')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createErro... Remove this comment to see the full error message
const { createErrorFromCode } = require('../../protocol/error')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
const { secureRandom, createCluster, newLogger, createTopic } = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RESOURCE_T... Remove this comment to see the full error message
const RESOURCE_TYPES = require('../../protocol/resourceTypes')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CONFIG_RES... Remove this comment to see the full error message
const CONFIG_RESOURCE_TYPES = require('../../protocol/configResourceTypes')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NOT_CONTRO... Remove this comment to see the full error message
const NOT_CONTROLLER = 41

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Admin', () => {
  let topicName: any, admin: any

  const getConfigEntries = (response: any) => response.resources.find((r: any) => r.resourceType === RESOURCE_TYPES.TOPIC).configEntries

  const getConfigValue = (configEntries: any, name: any) =>
    configEntries.find((c: any) => c.configName === name).configValue

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    topicName = `test-topic-${secureRandom()}`
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    admin && (await admin.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('describeConfigs', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the resources array is invalid', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.describeConfigs({ resources: null })).rejects.toHaveProperty(
        'message',
        'Invalid resources array null'
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.describeConfigs({ resources: 'this-is-not-an-array' })
      ).rejects.toHaveProperty('message', 'Invalid resources array this-is-not-an-array')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the resources array is empty', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.describeConfigs({ resources: [] })).rejects.toHaveProperty(
        'message',
        'Resources array cannot be empty'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if there are invalid resource types', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      const resources = [{ type: RESOURCE_TYPES.TOPIC }, { type: 1999 }]
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.describeConfigs({ resources })).rejects.toHaveProperty(
        'message',
        'Invalid resource type 1999: {"type":1999}'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if there are blank resource names', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      const resources = [
        { type: RESOURCE_TYPES.TOPIC, name: 'abc' },
        { type: RESOURCE_TYPES.TOPIC, name: null },
      ]
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.describeConfigs({ resources })).rejects.toHaveProperty(
        'message',
        'Invalid resource name null: {"type":2,"name":null}'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if there are invalid resource names', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      const resources = [
        { type: RESOURCE_TYPES.TOPIC, name: 'abc' },
        { type: RESOURCE_TYPES.TOPIC, name: 123 },
      ]
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.describeConfigs({ resources })).rejects.toHaveProperty(
        'message',
        'Invalid resource name 123: {"type":2,"name":123}'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if there are invalid resource configNames', async () => {
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })
      const resources = [
        { type: RESOURCE_TYPES.TOPIC, name: 'abc', configNames: [] },
        { type: RESOURCE_TYPES.TOPIC, name: 'def', configNames: 123 },
      ]
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.describeConfigs({ resources })).rejects.toHaveProperty(
        'message',
        'Invalid resource configNames 123: {"type":2,"name":"def","configNames":123}'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('describe all configs', async () => {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicName })
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })

      await admin.connect()
      const response = await admin.describeConfigs({
        resources: [{ type: RESOURCE_TYPES.TOPIC, name: topicName }],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(getConfigEntries(response).length).toBeGreaterThan(1)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('describe selected configs', async () => {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicName })
      admin = createAdmin({ cluster: createCluster(), logger: newLogger() })

      await admin.connect()
      const response = await admin.describeConfigs({
        resources: [
          {
            type: RESOURCE_TYPES.TOPIC,
            name: topicName,
            configNames: ['cleanup.policy'],
          },
        ],
      })

      const configEntries = getConfigEntries(response)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(configEntries.length).toEqual(1)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(getConfigValue(configEntries, 'cleanup.policy')).toEqual('delete')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('retries if the controller has moved', async () => {
      const cluster = createCluster()
      const brokerResponse = { resources: [true] }
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const broker = { describeConfigs: jest.fn(() => brokerResponse) }

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
        admin.describeConfigs({
          resources: [{ type: RESOURCE_TYPES.TOPIC, name: topicName }],
        })
      ).resolves.toEqual(brokerResponse)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.refreshMetadata).toHaveBeenCalledTimes(2)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.findControllerBroker).toHaveBeenCalledTimes(2)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.describeConfigs).toHaveBeenCalledTimes(1)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('describe broker configs', async () => {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicName })

      const cluster = createCluster()
      admin = createAdmin({ cluster, logger: newLogger() })
      await admin.connect()

      const metadata = await cluster.brokerPool.seedBroker.metadata()
      const brokers = metadata.brokers
      const brokerToDescribeConfig = brokers[1].nodeId.toString()

      const resources = [
        {
          type: RESOURCE_TYPES.TOPIC,
          name: topicName,
          configNames: ['cleanup.policy'],
        },
        {
          type: CONFIG_RESOURCE_TYPES.BROKER,
          name: brokerToDescribeConfig,
        },
      ]

      const response = await admin.describeConfigs({ resources })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(response.resources.length).toEqual(2)
    })
  })
})
