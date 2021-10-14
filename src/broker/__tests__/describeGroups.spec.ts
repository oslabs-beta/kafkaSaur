// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Broker'.
const Broker = require('../index')
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
  secureRandom,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createConn... Remove this comment to see the full error message
  createConnection,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'retryProto... Remove this comment to see the full error message
  retryProtocol,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
  createCluster,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createCons... Remove this comment to see the full error message
const createConsumer = require('../../consumer')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Broker > DescribeGroups', () => {
  let groupId: any, topicName: any, seedBroker: any, broker: any, cluster, consumer: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    groupId = `consumer-group-id-${secureRandom()}`
    topicName = `test-topic-${secureRandom()}`
    seedBroker = new Broker({
      connection: createConnection(),
      logger: newLogger(),
    })
    await seedBroker.connect()

    const {
      coordinator: { host, port },
    } = await retryProtocol(
      'GROUP_COORDINATOR_NOT_AVAILABLE',
      async () => await seedBroker.findGroupCoordinator({ groupId })
    )

    broker = new Broker({
      connection: createConnection({ host, port }),
      logger: newLogger(),
    })
    await broker.connect()

    cluster = createCluster()
    consumer = createConsumer({
      cluster,
      groupId,
      maxWaitTimeInMs: 1,
      logger: newLogger(),
    })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    consumer && (await consumer.disconnect())
    seedBroker && (await seedBroker.disconnect())
    broker && (await broker.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: topicName, fromBeginning: true })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    await consumer.run({ eachMessage: jest.fn() })
    const response = await broker.describeGroups({ groupIds: [groupId] })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response).toEqual({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
      groups: [
        {
          errorCode: 0,
          groupId,
          members: [
            {
              // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
              clientHost: expect.any(String),
              // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
              clientId: expect.any(String),
              // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
              memberAssignment: expect.anything(),
              // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
              memberId: expect.any(String),
              // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
              memberMetadata: expect.anything(),
            },
          ],
          protocol: 'RoundRobinAssigner',
          protocolType: 'consumer',
          state: 'Stable',
        },
      ],
    })
  })
})
