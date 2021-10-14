// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const { decode, parse } = require('./response')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSNot... Remove this comment to see the full error message
const { KafkaJSNotImplemented } = require('../../../../errors')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > Fetch > v4', () => {
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
    const data = await decode(Buffer.from(require('../fixtures/v4_response.json')))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(data).toEqual({
      throttleTime: 0,
      responses: [
        {
          topicName: 'test-topic-ab4d54774dcadc395a7f',
          partitions: [
            {
              partition: 0,
              errorCode: 0,
              highWatermark: '3',
              abortedTransactions: [],
              lastStableOffset: '3',
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('response with GZIP', async () => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
    const data = await decode(Buffer.from(require('../fixtures/v4_response_gzip.json')))

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(data).toEqual({
      throttleTime: 0,
      responses: [
        {
          topicName: 'test-topic-43c95a3dc68dbf78a359',
          partitions: [
            {
              partition: 0,
              errorCode: 0,
              highWatermark: '6',
              lastStableOffset: '6',
              abortedTransactions: [],
              messages: [
                {
                  magicByte: 2,
                  attributes: 0,
                  batchContext,
                  timestamp: '1509827900073',
                  offset: '0',
                  headers: {},
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('key-0'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('some-value-0'),
                  isControlRecord: false,
                },
                {
                  magicByte: 2,
                  attributes: 0,
                  batchContext,
                  timestamp: '1509827900073',
                  offset: '1',
                  headers: {},
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('key-1'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('some-value-1'),
                  isControlRecord: false,
                },
                {
                  magicByte: 2,
                  attributes: 0,
                  batchContext,
                  timestamp: '1509827900073',
                  offset: '2',
                  headers: {},
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('key-2'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('some-value-2'),
                  isControlRecord: false,
                },
                {
                  magicByte: 2,
                  attributes: 0,
                  batchContext,
                  timestamp: '1509827900073',
                  offset: '3',
                  headers: {},
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('key-1'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('some-value-1'),
                  isControlRecord: false,
                },
                {
                  magicByte: 2,
                  attributes: 0,
                  batchContext,
                  timestamp: '1509827900073',
                  offset: '4',
                  headers: {},
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('key-2'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('some-value-2'),
                  isControlRecord: false,
                },
                {
                  magicByte: 2,
                  attributes: 0,
                  batchContext,
                  timestamp: '1509827900073',
                  offset: '5',
                  headers: {},
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('key-3'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('some-value-3'),
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('response with 0.10 format', async () => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
    const data = await decode(Buffer.from(require('../fixtures/v4_response_010_format.json')))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(data).toEqual({
      throttleTime: 0,
      responses: [
        {
          topicName: 'test-topic2-08a2f12dddd8c924460f-78767-02073a3e-0622-4d0d-9ee9-b5d6a5a326f1',
          partitions: [
            {
              partition: 1,
              errorCode: 0,
              highWatermark: '1',
              lastStableOffset: '1',
              abortedTransactions: [],
              messages: [
                {
                  offset: '0',
                  size: 158,
                  crc: 2036710961,
                  magicByte: 1,
                  attributes: 0,
                  timestamp: '1538502423117',
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from(
                    'key-9bf6284dc11345082649-78767-f79b4780-f2aa-4bbb-979f-9a4815652b5c'
                  ),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from(
                    'value-9bf6284dc11345082649-78767-f79b4780-f2aa-4bbb-979f-9a4815652b5c'
                  ),
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('response with several RecordBatch (from Scala producer)', async () => {
    const data = await decode(
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      Buffer.from(require('../fixtures/v4_from_scala_producer_response.json'))
    )
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(data).toEqual({
      throttleTime: 0,
      responses: [
        {
          topicName: 'test-topic-bec28e95-0c2f-49d3-a230-2418dceac885',
          partitions: [
            {
              partition: 0,
              errorCode: 0,
              highWatermark: '6',
              lastStableOffset: '6',
              abortedTransactions: [],
              messages: [
                {
                  magicByte: 2,
                  attributes: 0,
                  batchContext,
                  timestamp: '1539644731680',
                  offset: '0',
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('KEY-1'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('VALUE-Lorem ipsum dolor sit amet-1'),
                  isControlRecord: false,
                  headers: {},
                },
                {
                  magicByte: 2,
                  attributes: 0,
                  batchContext,
                  timestamp: '1539644732194',
                  offset: '1',
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('KEY-2'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('VALUE-Lorem ipsum dolor sit amet-2'),
                  isControlRecord: false,
                  headers: {},
                },
                {
                  magicByte: 2,
                  attributes: 0,
                  batchContext,
                  timestamp: '1539644732699',
                  offset: '2',
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('KEY-3'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('VALUE-Lorem ipsum dolor sit amet-3'),
                  isControlRecord: false,
                  headers: {},
                },
                {
                  magicByte: 2,
                  attributes: 0,
                  batchContext,
                  timestamp: '1539644733203',
                  offset: '3',
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('KEY-4'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('VALUE-Lorem ipsum dolor sit amet-4'),
                  isControlRecord: false,
                  headers: {},
                },
                {
                  magicByte: 2,
                  attributes: 0,
                  batchContext,
                  timestamp: '1539644733708',
                  offset: '4',
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('KEY-5'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('VALUE-Lorem ipsum dolor sit amet-5'),
                  isControlRecord: false,
                  headers: {},
                },
                {
                  magicByte: 2,
                  attributes: 0,
                  batchContext,
                  timestamp: '1539644734213',
                  offset: '5',
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('KEY-6'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('VALUE-Lorem ipsum dolor sit amet-6'),
                  isControlRecord: false,
                  headers: {},
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('response with mixed formats (0.10 MessageSet + 0.11 RecordBatch)', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('decode only the 0.10 messages, 0.11 should be decoded on the next request', async () => {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      const data = await decode(Buffer.from(require('../fixtures/v4_response_mixed_formats.json')))
      const messagesMagicBytes = data.responses[0].partitions[0].messages.map((m: any) => m.magicByte)

      // the fixture is too big, jest deepCheck matcher takes too long to compare the object,
      // and the purpose of the test is to check if the decoder can skip the 0.11 on this request
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(new Set(messagesMagicBytes)).toEqual(new Set([1]))
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('response with an unconfigured compression codec (snappy)', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws KafkaJSNotImplemented error', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
        decode(Buffer.from(require('../fixtures/v4_response_snappy.json')))
      ).rejects.toThrow(KafkaJSNotImplemented)
    })
  })
})
