// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV1P... Remove this comment to see the full error message
const RequestV1Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > JoinGroup > v1', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const { buffer } = await RequestV1Protocol({
      groupId: 'consumer-group-id-5d520373e1cf4d03ca77-21486-90948f57-528c-4c3b-ba72-bf1e0d9bbc56',
      sessionTimeout: 30000,
      rebalanceTimeout: 60000,
      memberId: '',
      protocolType: 'consumer',
      groupProtocols: [
        {
          name: 'AssignerName',
          // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
          metadata: Buffer.from(require('../fixtures/v1_assignerMetadata.json')),
        },
      ],
    }).encode()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v1_request.json')))
  })
})
