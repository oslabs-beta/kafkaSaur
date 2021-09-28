// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MessageDec... Remove this comment to see the full error message
const MessageDecoder = require('./decoder')

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const MessageV0 = require('./v0')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const MessageV1 = require('./v1')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Message > decoder', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('v0', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('decode', () => {
      const message = MessageV0({ key: 'v0-key', value: 'v0-value' })
      const offset = '0'
      const size = message.size()
      const { buffer } = new Encoder().writeInt32(size).writeEncoder(message)

      const decoder = new Decoder(buffer)
      decoder.readInt32() // read the size to be more realistic

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(MessageDecoder(offset, size, decoder)).toEqual({
        offset,
        size,
        crc: 1857563124,
        magicByte: 0,
        attributes: 0,
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
        key: Buffer.from('v0-key'),
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
        value: Buffer.from('v0-value'),
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if it is a partial message', () => {
      const message = MessageV0({ key: 'v0-key', value: 'v0-value' })
      const offset = '0'
      const size = message.size()
      const { buffer } = new Encoder().writeInt32(size).writeEncoder(message)

      const decoder = new Decoder(buffer)

      // read more to reduce the size of the buffer
      decoder.readInt32()
      decoder.readInt32()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => MessageDecoder(offset, size, decoder)).toThrowError(
        /Tried to decode a partial message/
      )
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('v1', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('decode', () => {
      const message = MessageV1({ key: 'v0-key', value: 'v0-value', timestamp: 1509827481681 })
      const offset = '0'
      const size = message.size()
      const { buffer } = new Encoder().writeInt32(size).writeEncoder(message)

      const decoder = new Decoder(buffer)
      decoder.readInt32() // read the size to be more realistic

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(MessageDecoder(offset, size, decoder)).toEqual({
        offset,
        size,
        crc: 1931824201,
        magicByte: 1,
        attributes: 0,
        timestamp: '1509827481681',
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
        key: Buffer.from('v0-key'),
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
        value: Buffer.from('v0-value'),
      })
    })
  })
})
