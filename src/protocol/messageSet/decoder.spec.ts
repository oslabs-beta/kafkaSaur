// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
import Encoder from '../encoder'
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
import Decoder from '../decoder'
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MessageSet... Remove this comment to see the full error message
import MessageSet from './index'
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MessageSet... Remove this comment to see the full error message
import MessageSetDecoder from './decoder'

const messages = [
  {
    offset: '0',
    size: 31,
    crc: 120234579,
    magicByte: 0,
    attributes: 0,
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    key: Buffer.from('key-0'),
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    value: Buffer.from('some-value-0'),
  },
  {
    offset: '1',
    size: 31,
    crc: -141862522,
    magicByte: 0,
    attributes: 0,
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    key: Buffer.from('key-1'),
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    value: Buffer.from('some-value-1'),
  },
  {
    offset: '2',
    size: 31,
    crc: 1025004472,
    magicByte: 0,
    attributes: 0,
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    key: Buffer.from('key-2'),
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    value: Buffer.from('some-value-2'),
  },
]

const Fixtures = {
  v0: {
    uncompressed: {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
      data: require('./fixtures/messages_v0_uncompressed.json'),
      output: messages,
    },
    gzip: {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
      data: require('./fixtures/messages_v0_GZIP.json'),
      output: messages,
    },
  },
}

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > MessageSet > decoder', () => {
  Object.keys(Fixtures).forEach(version => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe(`message ${version}`, () => {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      Object.keys(Fixtures[version]).forEach(option => {
        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
        test(`decode ${option} messages`, async () => {
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          const { data, output } = Fixtures[version][option]
          // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
          const decoder = new Decoder(Buffer.from(data))
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          await expect(MessageSetDecoder(decoder)).resolves.toEqual(output)
        })
      })
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('skip partial messages', async () => {
    const messageSet = MessageSet({
      messageVersion: 0,
      entries: [{ key: 'v0-key', value: 'v0-value', offset: 10 }],
    })

    // read some bytes to simulate a partial message
    const messageSetBuffer = messageSet.buffer.slice(Decoder.int32Size(), messageSet.buffer.length)

    const temp = new Encoder()
    temp.buffer = messageSetBuffer

    const { buffer } = new Encoder().writeInt32(messageSet.size()).writeEncoder(temp)
    const decoder = new Decoder(buffer)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(MessageSetDecoder(decoder)).resolves.toEqual([])
  })
})
