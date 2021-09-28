// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'unsupporte... Remove this comment to see the full error message
const { unsupportedVersionResponse } = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const { decode, parse } = require('./response')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > ApiVersions > v0', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('response', async () => {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const data = await decode(Buffer.from(require('../fixtures/v0_response.json')))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(data).toEqual({
      errorCode: 0,
      apiVersions: [
        { apiKey: 0, minVersion: 0, maxVersion: 2 },
        { apiKey: 1, minVersion: 0, maxVersion: 3 },
        { apiKey: 2, minVersion: 0, maxVersion: 1 },
        { apiKey: 3, minVersion: 0, maxVersion: 2 },
        { apiKey: 4, minVersion: 0, maxVersion: 0 },
        { apiKey: 5, minVersion: 0, maxVersion: 0 },
        { apiKey: 6, minVersion: 0, maxVersion: 3 },
        { apiKey: 7, minVersion: 1, maxVersion: 1 },
        { apiKey: 8, minVersion: 0, maxVersion: 2 },
        { apiKey: 9, minVersion: 0, maxVersion: 2 },
        { apiKey: 10, minVersion: 0, maxVersion: 0 },
        { apiKey: 11, minVersion: 0, maxVersion: 1 },
        { apiKey: 12, minVersion: 0, maxVersion: 0 },
        { apiKey: 13, minVersion: 0, maxVersion: 0 },
        { apiKey: 14, minVersion: 0, maxVersion: 0 },
        { apiKey: 15, minVersion: 0, maxVersion: 0 },
        { apiKey: 16, minVersion: 0, maxVersion: 0 },
        { apiKey: 17, minVersion: 0, maxVersion: 0 },
        { apiKey: 18, minVersion: 0, maxVersion: 0 },
        { apiKey: 19, minVersion: 0, maxVersion: 1 },
        { apiKey: 20, minVersion: 0, maxVersion: 0 },
      ],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(parse(data)).resolves.toBeTruthy()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('throws KafkaJSProtocolError if the api is not supported', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(decode(unsupportedVersionResponse())).rejects.toThrow(
      /The version of API is not supported/
    )
  })
})
