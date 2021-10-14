// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Broker'.
const Broker = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MemberMeta... Remove this comment to see the full error message
const { MemberMetadata } = require('../../consumer/assignerProtocol')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
const { secureRandom, createConnection, newLogger, retryProtocol } = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Broker > JoinGroup', () => {
  let groupId: any, topicName: any, seedBroker: any, broker: any

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
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    seedBroker && (await seedBroker.disconnect())
    broker && (await broker.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const response = await broker.joinGroup({
      groupId,
      sessionTimeout: 30000,
      rebalanceTimeout: 60000,
      groupProtocols: [
        {
          name: 'AssignerName',
          metadata: MemberMetadata.encode({ version: 1, topics: [topicName] }),
        },
      ],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response).toEqual({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
      errorCode: 0,
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      generationId: expect.any(Number),
      groupProtocol: 'AssignerName',
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      leaderId: expect.any(String),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      memberId: expect.any(String),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      members: expect.arrayContaining([
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.objectContaining({
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          memberId: expect.any(String),
          groupInstanceId: null,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          memberMetadata: expect.any(Buffer),
        }),
      ]),
    })
  })
})
