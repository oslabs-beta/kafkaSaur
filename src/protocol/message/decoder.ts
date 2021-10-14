/** @format */

import {
  KafkaJSPartialMessageError,
  KafkaJSUnsupportedMagicByteInMessageSet,
} from '../../errors.ts';
import V0Decoder from './v0/decoder.ts';
import V1Decoder from './v1/decoder.ts';
import { Decoder } from '../decoder.ts';
import { Buffer } from 'https://deno.land/std@0.110.0/node/buffer.ts';

const decodeMessage = (decoder: Decoder, magicByte: number) => {
  switch (magicByte) {
    case 0:
      return V0Decoder(decoder);
    case 1:
      return V1Decoder(decoder);
    default:
      throw new KafkaJSUnsupportedMagicByteInMessageSet(null, null, null);
  }
};

export default (offset: number, size: number, decoder: Decoder) => {
  // Don't decrement decoder.offset because slice is already considering the current
  // offset of the decoder
  const remainingBytes = Buffer.byteLength(decoder.slice(size).buffer);

  if (remainingBytes < size) {
    throw new KafkaJSPartialMessageError(
      `Tried to decode a partial message: remainingBytes(${remainingBytes}) < messageSize(${size})`
    );
  }

  const crc = decoder.readInt32();
  const magicByte = decoder.readInt8();
  const message = decodeMessage(decoder, magicByte);
  return Object.assign({ offset, size, crc, magicByte }, message);
};
