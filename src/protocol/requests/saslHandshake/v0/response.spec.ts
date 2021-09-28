// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'unsupporte... Remove this comment to see the full error message
const { unsupportedVersionResponse } = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const { decode } = require('./response')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > SASLHandshake > v0', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('throws KafkaJSProtocolError if the api is not supported', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(decode(unsupportedVersionResponse())).rejects.toThrow(
      /The version of API is not supported/
    )
  })
})
