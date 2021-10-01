// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
import ApiVersions from './index'
const ApiVersionsV0 = ApiVersions.protocol({ version: 0 })
const ApiVersionsV1 = ApiVersions.protocol({ version: 1 })
const ApiVersionsV2 = ApiVersions.protocol({ version: 2 })

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > ApiVersions', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('V0', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('logs response errors', () => {
      const protocolV0 = ApiVersionsV0()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(protocolV0.logResponseError).toBe(true)
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('V1+', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not log response errors', () => {
      const protocolV1 = ApiVersionsV1()
      const protocolV2 = ApiVersionsV2()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(protocolV1.logResponseError).toBe(false)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(protocolV2.logResponseError).toBe(false)
    })
  })
})
