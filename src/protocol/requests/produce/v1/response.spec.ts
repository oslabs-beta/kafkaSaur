// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createErro... Remove this comment to see the full error message
const { createErrorFromCode } = require('../../../error')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'response'.
const response = require('./response')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > Produce > v1', () => {
  let decoded: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    decoded = {
      topics: [
        {
          topicName: 'test-topic-1',
          partitions: [
            // offset is a string to prevent int64 outside of Number.MAX_VALUE to be rounded
            { partition: 0, errorCode: 0, offset: '16' },
            { partition: 1, errorCode: 0, offset: '2' },
          ],
        },
        {
          topicName: 'test-topic-2',
          partitions: [{ partition: 4, errorCode: 0, offset: '11' }],
        },
      ],
      throttleTime: 1000,
    }
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('response', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('decode', async () => {
      const encoded = new Encoder()
        .writeArray([
          new Encoder().writeString('test-topic-1').writeArray([
            new Encoder()
              .writeInt32(0)
              .writeInt16(0)
              .writeInt64(16),
            new Encoder()
              .writeInt32(1)
              .writeInt16(0)
              .writeInt64(2),
          ]),
          new Encoder().writeString('test-topic-2').writeArray([
            new Encoder()
              .writeInt32(4)
              .writeInt16(0)
              .writeInt64(11),
          ]),
        ])
        .writeInt32(1000)

      const decodedPayload = await response.decode(encoded.buffer)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decodedPayload).toEqual(decoded)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('parse', async () => {
      const parsedPayload = await response.parse(decoded)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(parsedPayload).toEqual(decoded)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('when errorCode is different than SUCCESS_CODE', async () => {
      decoded.topics[0].partitions[0].errorCode = 5
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(response.parse(decoded)).rejects.toHaveProperty(
        'message',
        createErrorFromCode(5).message
      )
    })
  })
})
