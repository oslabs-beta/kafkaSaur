// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const { decode, parse } = require('./response')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > ListOffsets > v3', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('response', async () => {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const data = await decode(Buffer.from(require('../fixtures/v2_response.json')))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(data).toEqual({
      clientSideThrottleTime: 0,
      throttleTime: 0,
      responses: [
        {
          topic: 'test-topic-84efe7aaafc3844b00c1-36211-2ee431b4-d40b-4df8-b2c8-fc9e33ab5c77',
          partitions: [{ partition: 0, errorCode: 0, timestamp: '-1', offset: '1' }],
        },
      ],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(parse(data)).resolves.toBeTruthy()
  })
})
