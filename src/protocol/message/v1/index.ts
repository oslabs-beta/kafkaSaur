/** @format */

import { Encoder } from '../../encoder.ts';
import crc32 from '../../crc32.ts';
import Compression from '../compression/index.ts';
import { Buffer } from 'https://deno.land/std@0.110.0/node/buffer.ts';

const {
  Types,
  COMPRESSION_CODEC_MASK,
}  = Compression;
/**
 * v1 (supported since 0.10.0)
 * Message => Crc MagicByte Attributes Key Value
 *   Crc => int32
 *   MagicByte => int8
 *   Attributes => int8
 *   Timestamp => int64
 *   Key => bytes
 *   Value => bytes
 */

export default ({
  compression = Types.None,
  timestamp = Date.now(),
  key,
  value,
}: {
  compression?: number;
  timestamp: number;
  key: any;
  value: any;
}) => {
  const content = new Encoder()
    .writeInt8(1) // magicByte
    .writeInt8(compression & COMPRESSION_CODEC_MASK)
    .writeInt64(timestamp)
    .writeBytes(key)
    .writeBytes(value);

  const crc = crc32(content);
  return new Encoder().writeInt32(crc).writeEncoder(content);
};
