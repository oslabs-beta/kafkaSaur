// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV5P... Remove this comment to see the full error message
const RequestV5Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > Fetch > v5', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const minBytes = 1
    const maxBytes = 10485760 // 10MB
    const maxWaitTime = 100
    const maxBytesPerPartition = 1048576 // 1MB
    const topics = [
      {
        topic: 'test-topic-c935d678835de2c9c79e-2064-677041b7-df54-4d4d-a53a-b9133d2fdc8c',
        partitions: [{ partition: 0, fetchOffset: 0, maxBytes: maxBytesPerPartition }],
      },
    ]

    const { buffer } = await RequestV5Protocol({
      replicaId: -1,
      maxWaitTime,
      minBytes,
      maxBytes,
      topics,
    }).encode()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v5_request.json')))
  })
})
