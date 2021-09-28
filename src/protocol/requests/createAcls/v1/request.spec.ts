// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV1P... Remove this comment to see the full error message
const RequestV1Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > CreateAcls > v1', () => {
  let args: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    args = {
      creations: [
        {
          resourceType: 2,
          resourceName:
            'test-topic-392850dd6d7a5d5b19ce-14472-4a2169c1-4784-4717-b2d1-9189bdfb8322',
          resourcePatternType: 3,
          principal: 'User:bob-4330407946585067d2b2-14472-2904446a-488c-4e40-8d24-cd7f758de713',
          host: '*',
          operation: 2,
          permissionType: 3,
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
