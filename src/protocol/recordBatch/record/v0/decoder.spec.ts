// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const recordDecoder = require('./decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TimestampT... Remove this comment to see the full error message
const TimestampTypes = require('../../../timestampTypes')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > RecordBatch > Record > v0', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('decodes', async () => {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const decoder = new Decoder(Buffer.from(require('../../fixtures/v0_record.json')))

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(
      recordDecoder(decoder, {
        firstOffset: '0',
        firstTimestamp: '1509827900073',
        magicByte: 2,
      })
    ).toEqual({
      offset: '0',
      magicByte: 2,
      attributes: 0,
      batchContext: {
        firstOffset: '0',
        firstTimestamp: '1509827900073',
        magicByte: 2,
      },
      timestamp: '1509827900073',
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      headers: { 'header-key-0': Buffer.from('header-value-0') },
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      key: Buffer.from('key-0'),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      value: Buffer.from('some-value-0'),
      isControlRecord: false, // Default to false
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('uses record batch maxTimestamp when topic is configured with timestamp type LOG_APPEND_TIME', async () => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
    const decoder = new Decoder(Buffer.from(require('../../fixtures/v0_record.json')))
    const batchContext = {
      firstOffset: '0',
      firstTimestamp: '1509827900073',
      magicByte: 2,
      maxTimestamp: '1597425188809',
      timestampType: TimestampTypes.LOG_APPEND_TIME,
    }

    const decoded = recordDecoder(decoder, batchContext)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(decoded.batchContext).toEqual(batchContext)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(decoded.timestamp).toEqual(batchContext.maxTimestamp)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('decodes control record', async () => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
    const decoder = new Decoder(Buffer.from(require('../../fixtures/v0_record.json')))

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(
      recordDecoder(decoder, {
        firstOffset: '0',
        firstTimestamp: '1509827900073',
        magicByte: 2,
        isControlBatch: true,
      })
    ).toEqual({
      offset: '0',
      magicByte: 2,
      attributes: 0,
      batchContext: {
        firstOffset: '0',
        firstTimestamp: '1509827900073',
        isControlBatch: true,
        magicByte: 2,
      },
      timestamp: '1509827900073',
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      headers: { 'header-key-0': Buffer.from('header-value-0') },
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      key: Buffer.from('key-0'),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      value: Buffer.from('some-value-0'),
      isControlRecord: true,
    })
  })
})
