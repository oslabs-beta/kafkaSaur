/** @format */

import { KafkaJSNotImplemented } from '../../../errors.ts';
import gzip from './gzip.ts';

const COMPRESSION_CODEC_MASK = 0x07;
const Types = {
  None: 0,
  GZIP: 1,
  Snappy: 2,
  LZ4: 3,
  ZSTD: 4,
};

const Codecs = {
  [Types.GZIP]: () => gzip,
  [Types.Snappy]: () => {
    throw new KafkaJSNotImplemented();
  },
  [Types.LZ4]: () => {
    throw new KafkaJSNotImplemented();
  },
  [Types.ZSTD]: () => {
    throw new KafkaJSNotImplemented();
  },
};

const lookupCodec = (type: any) => (Codecs[type] ? Codecs[type]() : null);
const lookupCodecByAttributes = (attributes: any) => {
  const codec = Codecs[attributes & COMPRESSION_CODEC_MASK];
  return codec ? codec() : null;
};

export default {
  Types,
  Codecs,
  lookupCodec,
  lookupCodecByAttributes,
  COMPRESSION_CODEC_MASK,
};
