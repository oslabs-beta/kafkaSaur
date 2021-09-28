// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV1P... Remove this comment to see the full error message
const RequestV1Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > SaslAuthenticate > v1', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('request', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('PLAIN', () => {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('encode', async () => {
        const { buffer } = await RequestV1Protocol({
          // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
          authBytes: Buffer.from(require('../fixtures/plain_bytes.json')),
        }).encode()

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(buffer).toEqual(Buffer.from(require('../fixtures/v0_request_plain.json')))
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('SCRAM', () => {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('encode', async () => {
        const { buffer } = await RequestV1Protocol({
          // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
          authBytes: Buffer.from(require('../fixtures/scram256_bytes.json')),
        }).encode()

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(buffer).toEqual(Buffer.from(require('../fixtures/v0_request_scram256.json')))
      })
    })
  })
})
