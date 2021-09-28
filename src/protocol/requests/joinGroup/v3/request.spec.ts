// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV3P... Remove this comment to see the full error message
const RequestV3Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > JoinGroup > v3', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const { buffer } = await RequestV3Protocol({
      groupId: 'consumer-group-id-b522188a3a12a1f04cfb-23702-e1ff35c7-fde9-4d58-960a-2cef8af77eef',
      sessionTimeout: 30000,
      rebalanceTimeout: 60000,
      memberId: '',
      protocolType: 'consumer',
      groupProtocols: [
        {
          name: 'AssignerName',
          // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
          metadata: Buffer.from(require('../fixtures/v2_assignerMetadata.json')),
        },
      ],
    }).encode()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v2_request.json')))
  })
})
