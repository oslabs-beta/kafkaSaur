// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV1P... Remove this comment to see the full error message
import RequestV1Protocol from './request'

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > CreateAcls > v0', () => {
  let args: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    args = {
      creations: [
        {
          resourceType: 2,
          resourceName:
            'test-topic-119fe09ddb8092d6113d-15436-9fdcf583-7b77-4489-ac86-8af4a76ef420',
          principal: 'User:bob-575703bfac1e8c129332-15436-137b3edd-b741-4bb6-a266-318ac292beb8',
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
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v0_request.json')))
  })
})
