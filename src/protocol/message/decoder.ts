const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSPar... Remove this comment to see the full error message
  KafkaJSPartialMessageError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSUns... Remove this comment to see the full error message
  KafkaJSUnsupportedMagicByteInMessageSet,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../errors')

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const V0Decoder = require('./v0/decoder')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const V1Decoder = require('./v1/decoder')

const decodeMessage = (decoder: any, magicByte: any) => {
  switch (magicByte) {
    case 0:
      return V0Decoder(decoder)
    case 1:
      return V1Decoder(decoder)
    default:
      throw new KafkaJSUnsupportedMagicByteInMessageSet(        
// @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.

        `Unsupported MessageSet message version, magic byte: ${magicByte}`
      )
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = (offset: any, size: any, decoder: any) => {
  // Don't decrement decoder.offset because slice is already considering the current
  // offset of the decoder
  // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
  const remainingBytes = Buffer.byteLength(decoder.slice(size).buffer)

  if (remainingBytes < size) {
    throw new KafkaJSPartialMessageError(      
// @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.

      `Tried to decode a partial message: remainingBytes(${remainingBytes}) < messageSize(${size})`
    )
  }

  const crc = decoder.readInt32()
  const magicByte = decoder.readInt8()
  const message = decodeMessage(decoder, magicByte)
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  return Object.assign({ offset, size, crc, magicByte }, message)
}
