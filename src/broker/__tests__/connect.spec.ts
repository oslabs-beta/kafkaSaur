const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createConn... Remove this comment to see the full error message
  createConnection,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'connection... Remove this comment to see the full error message
  connectionOpts,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'saslSCRAM2... Remove this comment to see the full error message
  saslSCRAM256ConnectionOpts,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'testIfKafk... Remove this comment to see the full error message
  testIfKafkaAtLeast_1_1_0,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'describeIf... Remove this comment to see the full error message
  describeIfOauthbearerDisabled,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'saslEntrie... Remove this comment to see the full error message
  saslEntries,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Long'.
const Long = require('../../utils/long')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Broker'.
const Broker = require('../index')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Broker > connect', () => {
  let broker: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    broker = new Broker({
      connection: createConnection(connectionOpts()),
      logger: newLogger(),
    })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    broker && (await broker.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('establish the connection', async () => {
    await broker.connect()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(broker.connection.connected).toEqual(true)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('load api versions if not provided', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(broker.versions).toEqual(null)
    await broker.connect()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(broker.versions).toBeTruthy()
  })

  for (const e of saslEntries) {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test(`authenticate with SASL ${e.name} if configured`, async () => {
      broker = new Broker({
        connection: createConnection(e.opts()),
        logger: newLogger(),
      })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.isConnected()).toEqual(false)
      await broker.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.isConnected()).toEqual(true)
    })
  }

  describeIfOauthbearerDisabled('when SASL SCRAM is configured', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('parallel calls to connect using SCRAM', async () => {
      broker = new Broker({
        connection: createConnection(saslSCRAM256ConnectionOpts()),
        logger: newLogger(),
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.isConnected()).toEqual(false)

      // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
      await Promise.all([
        broker.connect(),
        broker.connect(),
        broker.connect(),
        broker.connect(),
        broker.connect(),
      ])

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.isConnected()).toEqual(true)
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('sets the authenticatedAt timer', async () => {
    const error = new Error('not connected')
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    const timer = process.hrtime()
    broker.authenticatedAt = timer
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    broker.connection.connect = jest.fn(() => {
      throw error
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(broker.authenticatedAt).toEqual(timer)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(broker.connect()).rejects.toEqual(error)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(broker.authenticatedAt).toBe(null)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isConnected', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('returns false when not connected', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.isConnected()).toEqual(false)
    })

    for (const e of saslEntries) {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test(`returns false when connected but not authenticated on connections with SASL ${e.name}`, async () => {
        broker = new Broker({
          connection: createConnection(e.opts()),
          logger: newLogger(),
        })
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(broker.isConnected()).toEqual(false)
        await broker.connection.connect()
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(broker.isConnected()).toEqual(false)
      })
    }

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('returns true when connected', async () => {
      await broker.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.isConnected()).toEqual(true)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when SaslAuthenticate protocol is available', () => {
      for (const e of saslEntries) {
        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
        test(`returns true when connected and authenticated on connections with SASL ${e.name}`, async () => {
          broker = new Broker({
            connection: createConnection(e.opts()),
            logger: newLogger(),
          })
          await broker.connect()
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(broker.isConnected()).toEqual(true)
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
        test('returns false when the session lifetime has expired', async () => {
          const sessionLifetime = 15000
          const reauthenticationThreshold = 10000
          broker = new Broker({
            connection: createConnection(e.opts()),
            logger: newLogger(),
            reauthenticationThreshold,
          })

          await broker.connect()
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(broker.isConnected()).toEqual(true)

          broker.sessionLifetime = Long.fromValue(sessionLifetime)
          const [seconds] = broker.authenticatedAt
          broker.authenticatedAt = [seconds - sessionLifetime / 1000, 0]

          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(broker.isConnected()).toEqual(false)
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
        test('returns true when the session lifetime is 0', async () => {
          broker = new Broker({
            connection: createConnection(e.opts()),
            logger: newLogger(),
          })

          await broker.connect()
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(broker.isConnected()).toEqual(true)

          broker.sessionLifetime = Long.ZERO
          broker.authenticatedAt = [0, 0]

          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(broker.isConnected()).toEqual(true)
        })

        // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
        testIfKafkaAtLeast_1_1_0(`authenticate with SASL ${e.name} if configured`, async () => {
          broker = new Broker({
            connection: createConnection(e.opts()),
            logger: newLogger(),
          })
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(broker.isConnected()).toEqual(false)
          await broker.connect()
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(broker.isConnected()).toEqual(true)
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(broker.supportAuthenticationProtocol).toEqual(true)
        })
      }
    })

    describeIfOauthbearerDisabled('when SASL SCRAM is configured', () => {
      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      testIfKafkaAtLeast_1_1_0('parallel calls to connect using SCRAM', async () => {
        broker = new Broker({
          connection: createConnection(saslSCRAM256ConnectionOpts()),
          logger: newLogger(),
        })

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(broker.isConnected()).toEqual(false)

        // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
        await Promise.all([
          broker.connect(),
          broker.connect(),
          broker.connect(),
          broker.connect(),
          broker.connect(),
        ])

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(broker.isConnected()).toEqual(true)
      })
    })
  })
})
