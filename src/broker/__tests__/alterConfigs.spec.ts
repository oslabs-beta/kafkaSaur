// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createConn... Remove this comment to see the full error message
const { createConnection, connectionOpts, secureRandom, newLogger } = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RESOURCE_T... Remove this comment to see the full error message
const RESOURCE_TYPES = require('../../protocol/resourceTypes')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Broker'.
const Broker = require('../index')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Broker > alterConfigs', () => {
  let seedBroker: any, broker: any

  const getConfigEntries = (response: any) => response.resources.find((r: any) => r.resourceType === RESOURCE_TYPES.TOPIC).configEntries

  const getConfigValue = (configEntries: any, name: any) =>
    configEntries.find((c: any) => c.configName === name).configValue

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    seedBroker = new Broker({
      connection: createConnection(connectionOpts()),
      logger: newLogger(),
    })
    await seedBroker.connect()

    const metadata = await seedBroker.metadata()
    const newBrokerData = metadata.brokers.find((b: any) => b.nodeId === metadata.controllerId)

    broker = new Broker({
      connection: createConnection(newBrokerData),
      logger: newLogger(),
    })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    seedBroker && (await seedBroker.disconnect())
    broker && (await broker.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    await broker.connect()
    const topicName1 = `test-topic-${secureRandom()}`
    const topicName2 = `test-topic-${secureRandom()}`

    await broker.createTopics({
      topics: [{ topic: topicName1 }, { topic: topicName2 }],
    })

    const CONFIG_NAME = 'cleanup.policy'
    let describeResponse = await broker.describeConfigs({
      resources: [
        {
          type: RESOURCE_TYPES.TOPIC,
          name: topicName1,
          configNames: [CONFIG_NAME],
        },
      ],
    })

    let cleanupPolicy = getConfigValue(getConfigEntries(describeResponse), CONFIG_NAME)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cleanupPolicy).toEqual('delete')

    const response = await broker.alterConfigs({
      resources: [
        {
          type: RESOURCE_TYPES.TOPIC,
          name: topicName1,
          configEntries: [
            {
              name: 'cleanup.policy',
              value: 'compact',
            },
          ],
        },
      ],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response).toEqual({
      resources: [
        {
          errorCode: 0,
          errorMessage: null,
          resourceName: topicName1,
          resourceType: RESOURCE_TYPES.TOPIC,
        },
      ],
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
    })

    describeResponse = await broker.describeConfigs({
      resources: [
        {
          type: RESOURCE_TYPES.TOPIC,
          name: topicName1,
          configNames: [CONFIG_NAME],
        },
      ],
    })

    cleanupPolicy = getConfigValue(getConfigEntries(describeResponse), CONFIG_NAME)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cleanupPolicy).toEqual('compact')
  })
})
