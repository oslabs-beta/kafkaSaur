// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV3P... Remove this comment to see the full error message
const RequestV3Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > ListOffsets > v3', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const timestamp = 1509285569484
    const topics = [
      {
        topic: 'test-topic-727705ce68c29fedddf4',
        partitions: [{ partition: 0, timestamp }],
      },
    ]

    const { buffer } = await RequestV3Protocol({ replicaId: -1, topics }).encode()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v2_request.json')))
  })
})
