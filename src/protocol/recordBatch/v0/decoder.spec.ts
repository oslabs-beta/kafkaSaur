// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../decoder')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const recordBatchDecoder = require('./decoder')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > RecordBatch > v0', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('decodes', async () => {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const decoder = new Decoder(Buffer.from(require('../fixtures/v0_recordbatch.json')))
    const decoded = await recordBatchDecoder(decoder)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(decoded).toEqual({
      firstOffset: '0',
      firstTimestamp: '1597425188775',
      partitionLeaderEpoch: 0,
      inTransaction: false,
      isControlBatch: false,
      lastOffsetDelta: 0,
      producerId: '-1',
      producerEpoch: 0,
      firstSequence: 0,
      maxTimestamp: '1597425188809',
      timestampType: 1,
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      records: expect.any(Object),
    })
  })
})
