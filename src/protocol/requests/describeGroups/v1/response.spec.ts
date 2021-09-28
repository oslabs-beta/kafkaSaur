// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const { decode, parse } = require('./response')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > DescribeGroups > v1', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('response', async () => {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const data = await decode(Buffer.from(require('../fixtures/v1_response.json')))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(data).toEqual({
      throttleTime: 0,
      groups: [
        {
          errorCode: 0,
          groupId:
            'consumer-group-id-4de0aa10ef94403a397d-53384-d2fee969-1446-4166-bc8e-c88e8daffdfe',
          state: 'Stable',
          protocolType: 'consumer',
          protocol: 'RoundRobinAssigner',
          members: [
            {
              memberId:
                'test-6ee008af511cbf89b897-53384-55bf525a-2ff5-49ef-8853-5fdf400a9c61-dbdee491-9f08-49d7-aa41-080b89bc69a8',
              clientId: 'test-6ee008af511cbf89b897-53384-55bf525a-2ff5-49ef-8853-5fdf400a9c61',
              clientHost: '/172.19.0.1',
              // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
              memberMetadata: Buffer.from(require('../fixtures/v1_memberMetadata.json')),
              // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
              memberAssignment: Buffer.from(require('../fixtures/v1_memberAssignment.json')),
            },
          ],
        },
      ],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(parse(data)).resolves.toBeTruthy()
  })
})
