// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV0P... Remove this comment to see the full error message
const RequestV0Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > Heartbeat > v0', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const groupId = 'consumer-group-id-ba8da1f6117562ed5615'
    const memberId = 'test-169232b069c4a377bc4b-040f5f1a-a469-4062-9d36-bd803d8d6767'
    const groupGenerationId = 1

    const { buffer } = await RequestV0Protocol({ groupId, groupGenerationId, memberId }).encode()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v0_request.json')))
  })
})
