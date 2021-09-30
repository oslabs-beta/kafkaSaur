// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV1P... Remove this comment to see the full error message
import RequestV1Protocol from './request'

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > AddPartitionsToTxn > v1', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const { buffer } = await RequestV1Protocol({
      transactionalId: 'test-transactional-id',
      producerId: '1001',
      producerEpoch: 0,
      topics: [
        {
          topic: 'test-topic',
          partitions: [0, 1, 2, 3],
        },
      ],
    }).encode()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v0_request.json')))
  })
})
