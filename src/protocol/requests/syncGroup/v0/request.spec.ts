// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV0P... Remove this comment to see the full error message
const RequestV0Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > SyncGroup > v0', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const groupId = 'test-group'
    const memberId = 'example-consumer-a7384422-58ff-476d-bb01-7e4ecc376578'

    const { buffer } = await RequestV0Protocol({
      groupId,
      generationId: 1,
      memberId,
      groupAssignment: [
        {
          memberId,
          memberAssignment: {
            'topic-test': [2, 5, 4, 1, 3, 0],
          },
        },
      ],
    }).encode()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v0_request.json')))
  })
})
