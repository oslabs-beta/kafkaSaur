// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestPro... Remove this comment to see the full error message
const RequestProtocol = require('./request')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV0P... Remove this comment to see the full error message
const RequestV0Protocol = require('../v0/request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > Produce > v1', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('request', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('use v0 protocol', () => {
      const request = RequestProtocol({})
      const requestV0 = RequestV0Protocol({})
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.apiKey).toEqual(requestV0.apiKey)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.apiName).toEqual(requestV0.apiName)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('has the correct apiVersion', () => {
      const request = RequestProtocol({})
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.apiVersion).toEqual(1)
    })
  })
})
