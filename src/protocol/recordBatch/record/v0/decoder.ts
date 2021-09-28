// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Long'.
const Long = require('../../../../utils/long')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const HeaderDecoder = require('../../header/v0/decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TimestampT... Remove this comment to see the full error message
const TimestampTypes = require('../../../timestampTypes')

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

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = (decoder: any, batchContext = {}) => {
  const {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'firstOffset' does not exist on type '{}'... Remove this comment to see the full error message
    firstOffset,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'firstTimestamp' does not exist on type '... Remove this comment to see the full error message
    firstTimestamp,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'magicByte' does not exist on type '{}'.
    magicByte,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isControlBatch' does not exist on type '... Remove this comment to see the full error message
    isControlBatch = false,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'timestampType' does not exist on type '{... Remove this comment to see the full error message
    timestampType,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'maxTimestamp' does not exist on type '{}... Remove this comment to see the full error message
    maxTimestamp,
  } = batchContext
  const attributes = decoder.readInt8()

  const timestampDelta = decoder.readVarLong()
  const timestamp =
    timestampType === TimestampTypes.LOG_APPEND_TIME && maxTimestamp
      ? maxTimestamp
      : Long.fromValue(firstTimestamp)
          .add(timestampDelta)
          .toString()

  const offsetDelta = decoder.readVarInt()
  const offset = Long.fromValue(firstOffset)
    .add(offsetDelta)
    .toString()

  const key = decoder.readVarIntBytes()
  const value = decoder.readVarIntBytes()
  const headers = decoder
    .readVarIntArray(HeaderDecoder)
    .reduce((
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'obj' implicitly has an 'any' type.
    obj,
    {
      key,
      value
    }: any
  ) => ({
    ...obj,
    [key]: value
  }), {})

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
