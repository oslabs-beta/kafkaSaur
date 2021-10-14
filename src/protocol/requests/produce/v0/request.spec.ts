// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestPro... Remove this comment to see the full error message
const RequestProtocol = require('./request')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MessageSet... Remove this comment to see the full error message
const MessageSet = require('../../../messageSet')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > Produce > v0', () => {
  let args: any, messageSet1, messageSet2

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    messageSet1 = [
      { key: '1', value: 'value-1' },
      { key: '2', value: 'value-2' },
    ]
    messageSet2 = [{ key: '3', value: 'value-3' }]
    args = {
      acks: -1,
      timeout: 1000,
      topicData: [
        {
          topic: 'test-topic-1',
          partitions: [
            { partition: 0, messages: messageSet1 },
            { partition: 1, messages: messageSet2 },
          ],
        },
      ],
    }
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('request', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when acks=0', () => {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('expectResponse returns false', () => {
        const request = RequestProtocol({ ...args, acks: 0 })
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(request.expectResponse()).toEqual(false)
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('encode', async () => {
      const request = RequestProtocol(args)
      const ms1 = MessageSet({ entries: args.topicData[0].partitions[0].messages })
      const ms2 = MessageSet({ entries: args.topicData[0].partitions[1].messages })

      const encoder = new Encoder()
        .writeInt16(-1)
        .writeInt32(1000)
        .writeArray([
          new Encoder().writeString('test-topic-1').writeArray([
            new Encoder()
              .writeInt32(0)
              .writeInt32(ms1.size())
              .writeEncoder(ms1),
            new Encoder()
              .writeInt32(1)
              .writeInt32(ms2.size())
              .writeEncoder(ms2),
          ]),
        ])

      const data = await request.encode()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(data.toJSON()).toEqual(encoder.toJSON())
    })
  })
})
