// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const Header = require('../../header/v0')

/**
 * v0
 * Record =>
 *   Length => Varint
 *   Attributes => Int8
 *   TimestampDelta => Varlong
 *   OffsetDelta => Varint
 *   Key => varInt|Bytes
 *   Value => varInt|Bytes
 *   Headers => [HeaderKey HeaderValue]
 *     HeaderKey => VarInt|String
 *     HeaderValue => VarInt|Bytes
 */

/**
 * @param [offsetDelta=0] {Integer}
 * @param [timestampDelta=0] {Long}
 * @param key {Buffer}
 * @param value {Buffer}
 * @param [headers={}] {Object}
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
  offsetDelta = 0,
  timestampDelta = 0,
  key,
  value,
  headers = {}
}: any) => {
  const headersArray = Object.keys(headers).map(headerKey => ({
    key: headerKey,
    value: headers[headerKey],
  }))

  const sizeOfBody =
    1 + // always one byte for attributes
    Encoder.sizeOfVarLong(timestampDelta) +
    Encoder.sizeOfVarInt(offsetDelta) +
    Encoder.sizeOfVarIntBytes(key) +
    Encoder.sizeOfVarIntBytes(value) +
    sizeOfHeaders(headersArray)

  return new Encoder()
    .writeVarInt(sizeOfBody)
    .writeInt8(0) // no used record attributes at the moment
    .writeVarLong(timestampDelta)
    .writeVarInt(offsetDelta)
    .writeVarIntBytes(key)
    .writeVarIntBytes(value)
    .writeVarIntArray(headersArray.map(Header))
}

const sizeOfHeaders = (headersArray: any) => {
  let size = Encoder.sizeOfVarInt(headersArray.length)

  for (const header of headersArray) {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const keySize = Buffer.byteLength(header.key)
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const valueSize = Buffer.byteLength(header.value)

    size += Encoder.sizeOfVarInt(keySize) + keySize

    if (header.value === null) {
      size += Encoder.sizeOfVarInt(-1)
    } else {
      size += Encoder.sizeOfVarInt(valueSize) + valueSize
    }
  }

  return size
}
