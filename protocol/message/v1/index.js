/** @format */

import { Encoder } from 'file:///C:/Users/wesge/Desktop/Coding/kafkaEx/protocol/encoder.js';
import { crc32 } from 'file:///C:/Users/wesge/Desktop/Coding/kafkaEx/protocol/crc32.js';
import Compression from 'file:///C:/Users/wesge/Desktop/Coding/kafkaEx/protocol/message/compression/index.js';

const COMPRESSION_CODEC_MASK = 0x07;

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

export function Version1({
  compression = Compression.None,
  timestamp = Date.now(),
  key,
  value,
}) {
  const content = new Encoder()
    .writeInt8(0) // magicByte
    .writeInt8(compression & COMPRESSION_CODEC_MASK)
    .writeInt64(timestamp)
    .writeBytes(key)
    .writeBytes(value);

  const crc = crc32(content);
  return new Encoder().writeInt32(crc).writeEncoder(content);
}
