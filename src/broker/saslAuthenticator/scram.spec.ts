// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../protocol/decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
const { newLogger } = require('testHelpers')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const SCRAM256 = require('./scram256')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Broker > SASL Authenticator > SCRAM', () => {
  let connection: any, saslAuthenticate: any, logger: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    connection = {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      authenticate: jest.fn(),
      sasl: { username: 'user', password: 'pencil' },
    }
    saslAuthenticate = ({
      request,
      response,
      authExpectResponse
    }: any) =>
      connection.authenticate({ request, response, authExpectResponse })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    logger = { debug: jest.fn() }
    logger.namespace = () => logger
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws KafkaJSSASLAuthenticationError for invalid username', async () => {
    const scram = new SCRAM256({ sasl: {} }, newLogger(), saslAuthenticate)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(scram.authenticate()).rejects.toThrow('Invalid username or password')
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws KafkaJSSASLAuthenticationError for invalid password', async () => {
    const scram = new SCRAM256({ sasl: { username: '<username>' } }, newLogger(), saslAuthenticate)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(scram.authenticate()).rejects.toThrow('Invalid username or password')
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('SCRAM 256', () => {
    let scram: any

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      scram = new SCRAM256(connection, logger, saslAuthenticate)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('saltPassword', async () => {
      connection.sasl.password = 'password'
      const clientMessageResponse = {
        s: 'enBxNzV4aGphMjJmbnZ0ejF5M2o4Y3JjdA==',
        i: '4096',
      }
      const saltedPassword = await scram.saltPassword(clientMessageResponse)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(saltedPassword.toString('hex')).toEqual(
        '72c2aaf3a8fd5732b83c5bd9fbf8d0c6e851d8d18d56fbb4e73813acf267009e'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('clientKey', async () => {
      connection.sasl.password = 'password'
      const clientMessageResponse = {
        s: 'enBxNzV4aGphMjJmbnZ0ejF5M2o4Y3JjdA==',
        i: '4096',
      }
      const clientKey = await scram.clientKey(clientMessageResponse)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(clientKey.toString('hex')).toEqual(
        '21819e176123554b9cec1dc1799b25ba112ae3c1d80e2b693476d28d99a15193'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('storedKey', async () => {
      connection.sasl.password = 'password'
      const clientMessageResponse = {
        s: 'enBxNzV4aGphMjJmbnZ0ejF5M2o4Y3JjdA==',
        i: '4096',
      }
      const clientKey = await scram.clientKey(clientMessageResponse)
      const storedKey = scram.H(clientKey)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(storedKey.toString('hex')).toEqual(
        '228713ebcc6a14f44503e9a0ecfe01d9e6b88adb39b890ade8b222fa4c323fd9'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('first message', () => {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('regular use case', async () => {
        scram.currentNonce = 'rOprNGfwEbeRWgbNEkqO'
        await scram.sendClientFirstMessage()
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(connection.authenticate).toHaveBeenCalledWith({
          authExpectResponse: true,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          request: expect.any(Object),
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          response: expect.any(Object),
        })

        const { request } = connection.authenticate.mock.calls[0][0]
        const encoder = await request.encode()
        const decoder = new Decoder(encoder.buffer)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(decoder.readBytes().toString()).toEqual(`n,,n=user,r=${scram.currentNonce}`)
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('username with comma', async () => {
        connection.sasl.username = 'bob,'
        await scram.sendClientFirstMessage()
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(connection.authenticate).toHaveBeenCalledWith({
          authExpectResponse: true,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          request: expect.any(Object),
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          response: expect.any(Object),
        })

        const { request } = connection.authenticate.mock.calls[0][0]
        const encoder = await request.encode()
        const decoder = new Decoder(encoder.buffer)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(decoder.readBytes().toString()).toEqual(`n,,n=bob=2C,r=${scram.currentNonce}`)
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('username with equals', async () => {
        connection.sasl.username = 'bob='
        await scram.sendClientFirstMessage()
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(connection.authenticate).toHaveBeenCalledWith({
          authExpectResponse: true,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          request: expect.any(Object),
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          response: expect.any(Object),
        })

        const { request } = connection.authenticate.mock.calls[0][0]
        const encoder = await request.encode()
        const decoder = new Decoder(encoder.buffer)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(decoder.readBytes().toString()).toEqual(`n,,n=bob=3D,r=${scram.currentNonce}`)
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('second message', () => {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('RFC5802#section-5 example data', async () => {
        scram.currentNonce = 'rOprNGfwEbeRWgbNEkqO'
        const clientMessageResponse = {
          original:
            'r=rOprNGfwEbeRWgbNEkqO%hvYDpWUa2RaTCAfuxFIlj)hNlF$k0,s=W22ZaJ0SNY7soEsUEjb6gQ==,i=4096',
          r: 'rOprNGfwEbeRWgbNEkqO%hvYDpWUa2RaTCAfuxFIlj)hNlF$k0',
          s: 'W22ZaJ0SNY7soEsUEjb6gQ',
          i: '4096',
        }

        await scram.sendClientFinalMessage(clientMessageResponse)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(connection.authenticate).toHaveBeenCalledWith({
          authExpectResponse: true,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          request: expect.any(Object),
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          response: expect.any(Object),
        })

        const { request } = connection.authenticate.mock.calls[0][0]
        const encoder = await request.encode()
        const decoder = new Decoder(encoder.buffer)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(decoder.readBytes().toString()).toEqual(
          'c=biws,r=rOprNGfwEbeRWgbNEkqO%hvYDpWUa2RaTCAfuxFIlj)hNlF$k0,p=dHzbZapWIk4jUhN+Ute9ytag9zjfMHgsqmmiz7AndVQ='
        )
      })
    })
  })
})
