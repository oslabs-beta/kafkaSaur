// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createErro... Remove this comment to see the full error message
const { createErrorFromCode } = require('../../../error')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'response'.
const response = require('./response')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > Metadata > v0', () => {
  let decoded: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    decoded = {
      brokers: [{ nodeId: 0, host: 'localhost', port: 9092 }],
      topicMetadata: [
        {
          topicErrorCode: 0,
          topic: 'test-topic-1',
          partitionMetadata: [
            { partitionErrorCode: 0, partitionId: 1, leader: 2, replicas: [3], isr: [4] },
          ],
        },
      ],
    }
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('response', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('decode', async () => {
      const encoded = new Encoder()
        .writeArray([
          new Encoder()
            .writeInt32(0)
            .writeString('localhost')
            .writeInt32(9092),
        ])
        .writeArray([
          new Encoder()
            .writeInt16(0)
            .writeString('test-topic-1')
            .writeArray([
              new Encoder()
                .writeInt16(0)
                .writeInt32(1)
                .writeInt32(2)
                .writeArray([3], 'int32')
                .writeArray([4], 'int32'),
            ]),
        ])

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
    test('when topicErrorCode is different than SUCCESS_CODE', async () => {
      decoded.topicMetadata[0].topicErrorCode = 5
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(response.parse(decoded)).rejects.toHaveProperty(
        'message',
        createErrorFromCode(5).message
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('when partitionErrorCode is different than SUCCESS_CODE', async () => {
      decoded.topicMetadata[0].partitionMetadata[0].partitionErrorCode = 5
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(response.parse(decoded)).rejects.toHaveProperty(
        'message',
        createErrorFromCode(5).message
      )
    })
  })
})
