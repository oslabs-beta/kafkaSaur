// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const initProducerId = require('./index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestV0'... Remove this comment to see the full error message
const requestV0 = require('./v0/request')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestV1'... Remove this comment to see the full error message
const requestV1 = require('./v1/request')

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.mock('./v0/request')
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.mock('./v1/request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > InitProducerId', () => {
  ;[requestV0, requestV1].forEach((request, version) => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe(`version v${version}`, () => {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('provides a default timeout of 5000', async () => {
        initProducerId.protocol({ version })({ transactionalId: 'foo' })
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(request).toHaveBeenCalledWith({ transactionalId: 'foo', transactionTimeout: 5000 })
      })
    })
  })
})
