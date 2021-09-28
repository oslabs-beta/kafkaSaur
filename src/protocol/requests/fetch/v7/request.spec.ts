// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV7P... Remove this comment to see the full error message
const RequestV7Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > Fetch > v7', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const minBytes = 1
    const maxBytes = 10485760 // 10MB
    const maxWaitTime = 100
    const maxBytesPerPartition = 1048576 // 1MB
    const topics = [
      {
        topic: 'test-topic-2077b9d2b36c4082e594-4020-b5a52b27-56df-4b87-800d-82c1cf26317d',
        partitions: [{ partition: 0, fetchOffset: 0, maxBytes: maxBytesPerPartition }],
      },
    ]

    const { buffer } = await RequestV7Protocol({
      replicaId: -1,
      maxWaitTime,
      minBytes,
      maxBytes,
      topics,
    }).encode()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v7_request.json')))
  })
})
