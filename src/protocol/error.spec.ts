// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errorCodes... Remove this comment to see the full error message
import { errorCodes, createErrorFromCode } from './error'

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > error', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createErrorFromCode', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('creates enhanced errors based on kafka error codes', () => {
      for (const errorCode of errorCodes) {
        const error = createErrorFromCode(errorCode.code)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(error).toHaveProperty('message', errorCode.message)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(error).toHaveProperty('type', errorCode.type)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(error).toHaveProperty('code', errorCode.code)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(error).toHaveProperty('retriable', errorCode.retriable)
      }
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('has a fallback error in case the error code is not supported', () => {
      const error = createErrorFromCode(123456789)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(error).toBeTruthy()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(error).toHaveProperty('type', 'KAFKAJS_UNKNOWN_ERROR_CODE')
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(error).toHaveProperty('code', -99)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(error).toHaveProperty('retriable', false)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(error).toHaveProperty('message', 'Unknown error code 123456789')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('links to the corresponding FAQ entry if available', () => {
      const rebalanceInProgressCode = errorCodes.find(
        ({
          type
        }: any) => type === 'REBALANCE_IN_PROGRESS'
      ).code
      const error = createErrorFromCode(rebalanceInProgressCode)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(error).toHaveProperty(
        'helpUrl',
        'https://kafka.js.org/docs/faq#what-does-it-mean-to-get-rebalance-in-progress-errors'
      )
    })
  })
})
