import {
  KafkaJSPartialMessageError,
  KafkaJSUnsupportedMagicByteInMessageSet,
} from '../../errors.js'

// const V0Decoder = require('./v0/decoder')
// const V1Decoder = require('./v1/decoder')
// import V0Decoder from './v0/decoder'
// import V1Decoder from './v1/decoder'
const V0Decoder = (decoder) => ({
  attributes: decoder.readInt8(),
  key: decoder.readBytes(),
  value: decoder.readBytes(),
})

const V1Decoder = (decoder) => ({
  attributes: decoder.readInt8(),
  timestamp: decoder.readInt64().toString(),
  key: decoder.readBytes(),
  value: decoder.readBytes(),
})

const decodeMessage = (decoder, magicByte) => {
  switch (magicByte) {
    case 0:
      return V0Decoder(decoder)
    case 1:
      return V1Decoder(decoder)
    default:
      throw new KafkaJSUnsupportedMagicByteInMessageSet(
        `Unsupported MessageSet message version, magic byte: ${magicByte}`
      )
  }
}

export default (offset, size, decoder) => {
  // Don't decrement decoder.offset because slice is already considering the current
  // offset of the decoder
  const remainingBytes = Buffer.byteLength(decoder.slice(size).buffer)

  if (remainingBytes < size) {
    throw new KafkaJSPartialMessageError(
      `Tried to decode a partial message: remainingBytes(${remainingBytes}) < messageSize(${size})`
    )
  }

  const crc = decoder.readInt32()
  const magicByte = decoder.readInt8()
  const message = decodeMessage(decoder, magicByte)
  return Object.assign({ offset, size, crc, magicByte }, message)
}
