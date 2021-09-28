// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const { decode, parse } = require('./response')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > SaslAuthenticate > v1', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PLAIN', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('response', async () => {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      const data = await decode(Buffer.from(require('../fixtures/v1_response_plain.json')))
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(data).toEqual({
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
        authBytes: Buffer.from({ data: [0, 0, 0, 0], type: 'Buffer' }),
        errorCode: 0,
        errorMessage: null,
        sessionLifetimeMs: '360000',
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(parse(data)).resolves.toBeTruthy()
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('SCRAM', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('response', async () => {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      const data = await decode(Buffer.from(require('../fixtures/v1_response_scram256.json')))
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(data).toEqual({
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
        authBytes: Buffer.from(require('../fixtures/scram256_firstRequest_response_v1.json')),
        errorCode: 0,
        errorMessage: null,
        sessionLifetimeMs: '360000',
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(parse(data)).resolves.toBeTruthy()
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('parse', () => {
    const SASL_AUTHENTICATION_FAILED = 58
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('uses the custom message when errorCode SASL_AUTHENTICATION_FAILED', async () => {
      const data = { errorCode: SASL_AUTHENTICATION_FAILED, errorMessage: 'Auth failed' }
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(parse(data)).rejects.toThrow(/Auth failed/)
    })
  })
})
