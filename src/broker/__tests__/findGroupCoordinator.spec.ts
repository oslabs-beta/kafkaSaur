// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Broker'.
const Broker = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
const { secureRandom, createConnection, newLogger, retryProtocol } = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Broker > FindGroupCoordinator', () => {
  let groupId: any, seedBroker: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    groupId = `consumer-group-id-${secureRandom()}`
    seedBroker = new Broker({
      connection: createConnection(),
      logger: newLogger(),
    })
    await seedBroker.connect()
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    seedBroker && (await seedBroker.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const response = await retryProtocol(
      'GROUP_COORDINATOR_NOT_AVAILABLE',
      async () => await seedBroker.findGroupCoordinator({ groupId })
    )

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response).toEqual({
      errorCode: 0,
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      errorMessage: expect.toBeOneOf([null, 'NONE']),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
      coordinator: {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        nodeId: expect.any(Number),
        host: 'localhost',
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        port: expect.any(Number),
      },
    })
  })
})
