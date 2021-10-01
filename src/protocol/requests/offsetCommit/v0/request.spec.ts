// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV0P... Remove this comment to see the full error message
const RequestV0Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > OffsetCommit > v0', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const topic = 'test-topic-eb1a285cda2e9f9a1021'
    const groupId = 'consumer-group-id-9ea5b85471316d2753ab'
    const topics = [{ topic, partitions: [{ partition: 0, offset: '0' }] }]

    const { buffer } = await RequestV0Protocol({ groupId, topics }).encode()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v0_request.json')))
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request with metadata', async () => {
    const topic = 'test-topic-eb1a285cda2e9f9a1021'
    const groupId = 'consumer-group-id-9ea5b85471316d2753ab'
    const topics = [{ topic, partitions: [{ partition: 0, offset: '0', metadata: 'test' }] }]

    const { buffer } = await RequestV0Protocol({ groupId, topics }).encode()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v0_request_metadata.json')))
  })
})
