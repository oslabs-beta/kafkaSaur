// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV1P... Remove this comment to see the full error message
const RequestV1Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > DescribeAcls > v1', () => {
  let args: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    args = {
      resourceType: 2,
      resourceName: 'test-topic-3091e37cb34e1e916cfa-18029-1b277b41-4f40-4740-9274-51f556f212c9',
      resourcePatternType: 3,
      host: '*',
      operation: 2,
      permissionType: 3,
    }
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const { buffer } = await RequestV1Protocol(args).encode()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v1_request.json')))
  })
})
