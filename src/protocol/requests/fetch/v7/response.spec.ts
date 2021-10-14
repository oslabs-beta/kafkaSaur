// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const { decode, parse } = require('./response')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > Fetch > v7', () => {
  const batchContext = {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    firstOffset: expect.any(String),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    firstSequence: expect.any(Number),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    firstTimestamp: expect.any(String),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    inTransaction: expect.any(Boolean),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    isControlBatch: expect.any(Boolean),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    lastOffsetDelta: expect.any(Number),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    magicByte: expect.any(Number),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    maxTimestamp: expect.any(String),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    partitionLeaderEpoch: expect.any(Number),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    producerEpoch: expect.any(Number),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    producerId: expect.any(String),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    timestampType: expect.any(Number),
  }

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('response', async () => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
    const data = await decode(Buffer.from(require('../fixtures/v7_response.json')))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(data).toEqual({
      throttleTime: 0,
      errorCode: 0,
      sessionId: 0,
      responses: [
        {
          topicName: 'test-topic-2077b9d2b36c4082e594-4020-b5a52b27-56df-4b87-800d-82c1cf26317d',
          partitions: [
            {
              partition: 0,
              errorCode: 0,
              highWatermark: '3',
              abortedTransactions: [],
              lastStableOffset: '3',
              lastStartOffset: '0',
              messages: [
                {
                  offset: '0',
                  magicByte: 2,
                  attributes: 0,
                  batchContext,
                  timestamp: '1509827900073',
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  headers: { 'header-key-0': Buffer.from('header-value-0') },
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('key-0'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('some-value-0'),
                  isControlRecord: false,
                },
                {
                  offset: '1',
                  magicByte: 2,
                  attributes: 0,
                  batchContext,
                  timestamp: '1509827900073',
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  headers: { 'header-key-1': Buffer.from('header-value-1') },
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('key-1'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('some-value-1'),
                  isControlRecord: false,
                },
                {
                  offset: '2',
                  magicByte: 2,
                  attributes: 0,
                  batchContext,
                  timestamp: '1509827900073',
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  headers: { 'header-key-2': Buffer.from('header-value-2') },
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('key-2'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('some-value-2'),
                  isControlRecord: false,
                },
              ],
            },
          ],
        },
      ],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(parse(data)).resolves.toBeTruthy()
  })
})
