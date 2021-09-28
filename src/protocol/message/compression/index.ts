// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSNot... Remove this comment to see the full error message
const { KafkaJSNotImplemented } = require('../../../errors')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'COMPRESSIO... Remove this comment to see the full error message
const COMPRESSION_CODEC_MASK = 0x07

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Types'.
const Types = {
  None: 0,
  GZIP: 1,
  Snappy: 2,
  LZ4: 3,
  ZSTD: 4,
}

const Codecs = {
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  [Types.GZIP]: () => require('./gzip'),
  [Types.Snappy]: () => {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    throw new KafkaJSNotImplemented('Snappy compression not implemented')
  },
  [Types.LZ4]: () => {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    throw new KafkaJSNotImplemented('LZ4 compression not implemented')
  },
  [Types.ZSTD]: () => {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    throw new KafkaJSNotImplemented('ZSTD compression not implemented')
  },
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'lookupCode... Remove this comment to see the full error message
const lookupCodec = (type: any) => Codecs[type] ? Codecs[type]() : null
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'lookupCode... Remove this comment to see the full error message
const lookupCodecByAttributes = (attributes: any) => {
  const codec = Codecs[attributes & COMPRESSION_CODEC_MASK]
  return codec ? codec() : null
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  Types,
  Codecs,
  lookupCodec,
  lookupCodecByAttributes,
  COMPRESSION_CODEC_MASK,
}
