// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV2P... Remove this comment to see the full error message
const RequestV2Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > OffsetCommit > v2', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const topic = 'test-topic-9167000121c242c36142'
    const groupId = 'consumer-group-id-3a1646e3e927e05cd0c2'
    const memberId = 'test-8aac10296d949b162708-6ff63ddf-1a5a-4f05-929c-17158875aa7f'
    const topics = [{ topic, partitions: [{ partition: 0, offset: '0' }] }]

    const { buffer } = await RequestV2Protocol({
      groupId,
      groupGenerationId: 1,
      memberId,
      retentionTime: -1,
      topics,
    }).encode()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v2_request.json')))
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const topic = 'test-topic-9167000121c242c36142'
    const groupId = 'consumer-group-id-3a1646e3e927e05cd0c2'
    const memberId = 'test-8aac10296d949b162708-6ff63ddf-1a5a-4f05-929c-17158875aa7f'
    const topics = [{ topic, partitions: [{ partition: 0, offset: '0', metadata: 'test' }] }]

    const { buffer } = await RequestV2Protocol({
      groupId,
      groupGenerationId: 1,
      memberId,
      retentionTime: -1,
      topics,
    }).encode()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v2_request_metadata.json')))
  })
})
