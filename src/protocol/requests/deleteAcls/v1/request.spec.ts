// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV1P... Remove this comment to see the full error message
const RequestV1Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > DeleteAcls > v1', () => {
  let args: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    args = {
      filters: [
        {
          resourceName:
            'test-topic-000b0fa9008f920bc684-20826-6bcf579e-e882-47b8-9586-e778588f9e78',
          resourceType: 2,
          resourcePatternType: 3,
          principal: 'User:bob-51fe15d9fc1c5a3be5f2-20826-fcf12830-b5a1-477a-8ac9-866a4088273a',
          host: '*',
          permissionType: 3,
          operation: 1,
        },
      ],
    }
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const { buffer } = await RequestV1Protocol(args).encode()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v1_request.json')))
  })
})
