// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV1P... Remove this comment to see the full error message
const RequestV1Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > SyncGroup > v1', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const { buffer } = await RequestV1Protocol({
      groupId: 'consumer-group-id-e15bd537f491e89484f1-24495-5c083268-3a66-4366-8afc-2c429edeb6af',
      generationId: 1,
      memberId:
        'test-d44f97e7d1a0622387a1-24495-d057a55d-fb7c-446d-98b7-3a3a8dff7944-1f460f6f-bf82-4448-9c18-09b0d7eaceb6',
      groupAssignment: [
        {
          memberId:
            'test-d44f97e7d1a0622387a1-24495-d057a55d-fb7c-446d-98b7-3a3a8dff7944-1f460f6f-bf82-4448-9c18-09b0d7eaceb6',
          // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
          memberAssignment: Buffer.from(require('../fixtures/v1_memberAssignment')),
        },
      ],
    }).encode()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v1_request.json')))
  })
})
