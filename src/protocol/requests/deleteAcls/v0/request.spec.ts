// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV0P... Remove this comment to see the full error message
const RequestV0Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > DeleteAcls > v0', () => {
  let args: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    args = {
      filters: [
        {
          resourceName:
            'test-topic-78d599e9d78a4da685ae-21381-e8f39f07-7d19-4677-aecb-bd0f731f1e28',
          resourceType: 2,
          resourcePatternType: 3,
          principal: 'User:bob-cd8856cf4f23fe19899c-21381-c20b6340-b95c-431d-9237-2f15e310fba7',
          host: '*',
          permissionType: 3,
          operation: 1,
        },
      ],
    }
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const { buffer } = await RequestV0Protocol(args).encode()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v0_request.json')))
  })
})
