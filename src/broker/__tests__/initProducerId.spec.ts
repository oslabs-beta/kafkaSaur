// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Broker'.
const Broker = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createConn... Remove this comment to see the full error message
const { createConnection, newLogger, retryProtocol, secureRandom } = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'COORDINATO... Remove this comment to see the full error message
const COORDINATOR_TYPES = require('../../protocol/coordinatorTypes')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Broker > InitProducerId', () => {
  let broker: any, seedBroker: any, transactionalId: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    transactionalId = `producer-group-id-${secureRandom()}`

    seedBroker = new Broker({
      connection: createConnection(),
      logger: newLogger(),
    })
    await seedBroker.connect()

    const {
      coordinator: { host, port },
    } = await retryProtocol(
      'GROUP_COORDINATOR_NOT_AVAILABLE',
      async () =>
        await seedBroker.findGroupCoordinator({
          groupId: transactionalId,
          coordinatorType: COORDINATOR_TYPES.TRANSACTION,
        })
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
  test('request with transaction id', async () => {
    const response = await broker.initProducerId({
      transactionalId,
      transactionTimeout: 30000,
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response).toEqual({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
      errorCode: 0,
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      producerId: expect.stringMatching(/\d+/),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      producerEpoch: expect.any(Number),
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request without transaction id', async () => {
    const response = await broker.initProducerId({ transactionTimeout: 30000 })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response).toEqual({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
      errorCode: 0,
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      producerId: expect.stringMatching(/\d+/),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      producerEpoch: expect.any(Number),
    })
  })
})
