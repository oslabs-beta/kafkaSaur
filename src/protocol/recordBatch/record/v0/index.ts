/** @format */
import { Buffer } from 'https://deno.land/std@0.110.0/node/buffer.ts';
import { Encoder } from '../../../encoder.ts';
import Header from '../../header/v0/index.ts';

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
export default ({
  offsetDelta = 0,
  timestampDelta = 0,
  key,
  value,
  headers = {},
}: any) => {
  const headersArray = Object.keys(headers).map((headerKey) => ({
    key: headerKey,
    value: headers[headerKey],
  }));

  const sizeOfBody =
    1 + // always one byte for attributes
    Encoder.sizeOfVarLong(timestampDelta) +
    Encoder.sizeOfVarInt(offsetDelta) +
    Encoder.sizeOfVarIntBytes(key) +
    Encoder.sizeOfVarIntBytes(value) +
    sizeOfHeaders(headersArray);

  return new Encoder()
    .writeVarInt(sizeOfBody)
    .writeInt8(0) // no used record attributes at the moment
    .writeVarLong(timestampDelta)
    .writeVarInt(offsetDelta)
    .writeVarIntBytes(key)
    .writeVarIntBytes(value)
    .writeVarIntArray(headersArray.map(Header), 'string');
};

const sizeOfHeaders = (headersArray: any) => {
  let size = Encoder.sizeOfVarInt(headersArray.length);

  for (const header of headersArray) {
    
    const keySize = Buffer.byteLength(header.key);
    
    const valueSize = Buffer.byteLength(header.value);

    size += Encoder.sizeOfVarInt(keySize) + keySize;

    if (header.value === null) {
      size += Encoder.sizeOfVarInt(-1);
    } else {
      size += Encoder.sizeOfVarInt(valueSize) + valueSize;
    }
  }

  return size;
};
