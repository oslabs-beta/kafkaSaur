import { fromValue } from '../../../../utils/long'
import HeaderDecoder from '../../header/v0/decoder'
import { LOG_APPEND_TIME } from '../../../timestampTypes'

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

export default (decoder, batchContext = {}) => {
  const {
    firstOffset,
    firstTimestamp,
    magicByte,
    isControlBatch = false,
    timestampType,
    maxTimestamp,
  } = batchContext
  const attributes = decoder.readInt8()

  const timestampDelta = decoder.readVarLong()
  const timestamp =
    timestampType === LOG_APPEND_TIME && maxTimestamp
      ? maxTimestamp
      : fromValue(firstTimestamp)
          .add(timestampDelta)
          .toString()

  const offsetDelta = decoder.readVarInt()
  const offset = fromValue(firstOffset)
    .add(offsetDelta)
    .toString()

  const key = decoder.readVarIntBytes()
  const value = decoder.readVarIntBytes()
  const headers = decoder
    .readVarIntArray(HeaderDecoder)
    .reduce((obj, { key, value }) => ({ ...obj, [key]: value }), {})

  return {
    magicByte,
    attributes, // Record level attributes are presently unused
    timestamp,
    offset,
    key,
    value,
    headers,
    isControlRecord: isControlBatch,
    batchContext,
  }
}
