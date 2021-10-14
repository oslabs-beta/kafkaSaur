// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV0P... Remove this comment to see the full error message
const RequestV0Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > LeaveGroup > v1', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const { buffer } = await RequestV0Protocol({
      groupId: 'consumer-group-id-82d77df5d0974e21502d-30919-0ec5e55e-e3e1-433a-bbed-96fe228408b4',
      memberId:
        'test-c598169a5d8dbedcb806-30919-ff1f3c53-1855-4c04-aadf-12d298160f5c-b41b37f8-6482-47c5-811e-e658ab656a75',
    }).encode()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v1_request.json')))
  })
})
