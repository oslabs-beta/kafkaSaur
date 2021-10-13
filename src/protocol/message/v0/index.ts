/** @format */

import { Encoder } from '../../encoder.ts';
import crc32 from '../../crc32.ts';
import compression from '../compression/index.ts';
import { Buffer } from 'https://deno.land/std@0.110.0/node/buffer.ts';

const {Types} = compression
const {COMPRESSION_CODEC_MASK} = compression

const Compression = Types
/**
 * v0
 * Message => Crc MagicByte Attributes Key Value
 *   Crc => int32
 *   MagicByte => int8
 *   Attributes => int8
 *   Key => bytes
 *   Value => bytes
 */

export default ({
  compression = Compression.None,
  key,
  value,
}: {
  compression?: number;
  key: any;
  value: any;
}) => {
  const content = new Encoder()
    .writeInt8(0) // magicByte
    .writeInt8(compression & COMPRESSION_CODEC_MASK)
    .writeBytes(key)
    .writeBytes(value);

  const crc = crc32(content);
  return new Encoder().writeInt32(crc).writeEncoder(content);
};
