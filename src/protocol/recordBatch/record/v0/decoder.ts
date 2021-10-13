/** @format */

import Long from '../../../../utils/long.ts';
import HeaderDecoder from '../../header/v0/decoder.ts';
import TimestampTypes from '../../../timestampTypes.ts';

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

export default (decoder: any, batchContext: any = {}) => {
  const {
    firstOffset,
    firstTimestamp,
    magicByte,
    isControlBatch = false,
    timestampType,
    maxTimestamp,
  }: any = batchContext;
  const attributes = decoder.readInt8();

  const timestampDelta = decoder.readVarLong();
  const timestamp =
    timestampType === TimestampTypes.LOG_APPEND_TIME && maxTimestamp
      ? maxTimestamp
      : Long.fromValue(firstTimestamp).add(timestampDelta).toString();

  const offsetDelta = decoder.readVarInt();
  const offset = Long.fromValue(firstOffset).add(offsetDelta).toString();

  const key = decoder.readVarIntBytes();
  const value = decoder.readVarIntBytes();
  const headers = decoder.readVarIntArray(HeaderDecoder).reduce(
    (obj: any, { key, value }: any) => ({
      ...obj,
      [key]: value,
    }),
    {}
  );

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
  };
};
