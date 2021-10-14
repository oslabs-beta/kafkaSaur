// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const { decode, parse } = require('./response')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > JoinGroup > v5', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('response', async () => {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const data = await decode(Buffer.from(require('../fixtures/v5_response.json')))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(data).toEqual({
      throttleTime: 0,
      clientSideThrottleTime: 0,
      errorCode: 0,
      generationId: 1,
      groupProtocol: 'AssignerName',
      leaderId:
        'test-b773bdb220aa2b862440-23702-2b1581f6-55ea-4af0-97f0-931d4f071111-68a2051d-7b30-4161-b920-89346d7b672b',
      memberId:
        'test-b773bdb220aa2b862440-23702-2b1581f6-55ea-4af0-97f0-931d4f071111-68a2051d-7b30-4161-b920-89346d7b672b',
      members: [
        {
          memberId:
            'test-b773bdb220aa2b862440-23702-2b1581f6-55ea-4af0-97f0-931d4f071111-68a2051d-7b30-4161-b920-89346d7b672b',
          groupInstanceId: 'group-instance-id',
          // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
          memberMetadata: Buffer.from(require('../fixtures/v2_assignerMetadata.json')),
        },
      ],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(parse(data)).resolves.toBeTruthy()
  })
})
