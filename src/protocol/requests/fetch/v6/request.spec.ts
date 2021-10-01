// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV6P... Remove this comment to see the full error message
const RequestV6Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > Fetch > v6', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const minBytes = 1
    const maxBytes = 10485760 // 10MB
    const maxWaitTime = 100
    const maxBytesPerPartition = 1048576 // 1MB
    const topics = [
      {
        topic: 'test-topic-07eae0edd6400fe2733a-3088-330080bb-97f1-4a09-89e1-f0fe5c137ab2',
        partitions: [{ partition: 0, fetchOffset: 0, maxBytes: maxBytesPerPartition }],
      },
    ]

    const { buffer } = await RequestV6Protocol({
      replicaId: -1,
      maxWaitTime,
      minBytes,
      maxBytes,
      topics,
    }).encode()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v6_request.json')))
  })
})
