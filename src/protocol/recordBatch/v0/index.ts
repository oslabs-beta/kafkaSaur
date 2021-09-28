// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Long'.
const Long = require('../../../utils/long')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'crc32C'.
const crc32C = require('../crc32C')
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Compressio... Remove this comment to see the full error message
  Types: Compression,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'lookupCode... Remove this comment to see the full error message
  lookupCodec,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'COMPRESSIO... Remove this comment to see the full error message
  COMPRESSION_CODEC_MASK,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../message/compression')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MAGIC_BYTE... Remove this comment to see the full error message
const MAGIC_BYTE = 2
const TIMESTAMP_MASK = 0 // The fourth lowest bit, always set this bit to 0 (since 0.10.0)
const TRANSACTIONAL_MASK = 16 // The fifth lowest bit

/**
 * v0
 * RecordBatch =>
 *  FirstOffset => int64
 *  Length => int32
 *  PartitionLeaderEpoch => int32
 *  Magic => int8
 *  CRC => int32
 *  Attributes => int16
 *  LastOffsetDelta => int32
 *  FirstTimestamp => int64
 *  MaxTimestamp => int64
 *  ProducerId => int64
 *  ProducerEpoch => int16
 *  FirstSequence => int32
 *  Records => [Record]
 */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RecordBatc... Remove this comment to see the full error message
const RecordBatch = async ({
  compression = Compression.None,
  firstOffset = Long.fromInt(0),
  firstTimestamp = Date.now(),
  maxTimestamp = Date.now(),
  partitionLeaderEpoch = 0,
  lastOffsetDelta = 0,
  transactional = false,
  producerId = Long.fromValue(-1), // for idempotent messages
  producerEpoch = 0, // for idempotent messages
  firstSequence = 0, // for idempotent messages
  records = [],
}) => {
  const COMPRESSION_CODEC = compression & COMPRESSION_CODEC_MASK
  const IN_TRANSACTION = transactional ? TRANSACTIONAL_MASK : 0
  const attributes = COMPRESSION_CODEC | TIMESTAMP_MASK | IN_TRANSACTION

  const batchBody = new Encoder()
    .writeInt16(attributes)
    .writeInt32(lastOffsetDelta)
    .writeInt64(firstTimestamp)
    .writeInt64(maxTimestamp)
    .writeInt64(producerId)
    .writeInt16(producerEpoch)
    .writeInt32(firstSequence)

  if (compression === Compression.None) {
    if (records.every(v => typeof v === typeof records[0])) {
      batchBody.writeArray(records, typeof records[0])
    } else {
      batchBody.writeArray(records)
    }
  } else {
    const compressedRecords = await compressRecords(compression, records)
    batchBody.writeInt32(records.length).writeBuffer(compressedRecords)
  }

  // CRC32C validation is happening here:
  // https://github.com/apache/kafka/blob/0.11.0.1/clients/src/main/java/org/apache/kafka/common/record/DefaultRecordBatch.java#L148

  const batch = new Encoder()
    .writeInt32(partitionLeaderEpoch)
    .writeInt8(MAGIC_BYTE)
    .writeUInt32(crc32C(batchBody.buffer))
    .writeEncoder(batchBody)

  return new Encoder().writeInt64(firstOffset).writeBytes(batch.buffer)
}

const compressRecords = async (compression: any, records: any) => {
  const codec = lookupCodec(compression)
  const recordsEncoder = new Encoder()

  recordsEncoder.writeEncoderArray(records)

  return codec.compress(recordsEncoder)
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  RecordBatch,
  MAGIC_BYTE,
}
