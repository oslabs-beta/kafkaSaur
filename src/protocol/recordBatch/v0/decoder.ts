/** @format */

import { Decoder } from '../../decoder.ts';
import { KafkaJSPartialMessageError } from '../../../errors.ts';
import compression from '../../message/compression/index.ts';
import RecordDecoder from '../record/v0/decoder.ts';
import TimestampTypes from '../../timestampTypes.ts';
import { Buffer } from 'https://deno.land/std@0.110.0/node/buffer.ts';

const TIMESTAMP_TYPE_FLAG_MASK = 0x8;
const TRANSACTIONAL_FLAG_MASK = 0x10;
const CONTROL_FLAG_MASK = 0x20;
const { lookupCodecByAttributes } = compression;
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

export default async (fetchDecoder: any) => {
  const firstOffset = fetchDecoder.readInt64().toString();
  const length = fetchDecoder.readInt32();
  const decoder = fetchDecoder.slice(length);
  fetchDecoder.forward(length);

  const remainingBytes = Buffer.byteLength(decoder.buffer);

  if (remainingBytes < length) {
    throw new KafkaJSPartialMessageError(
      `Tried to decode a partial record batch: remainingBytes(${remainingBytes}) < recordBatchLength(${length})`
    );
  }

  const partitionLeaderEpoch = decoder.readInt32();

  // The magic byte was read by the Fetch protocol to distinguish between
  // the record batch and the legacy message set. It's not used here but
  // it has to be read.
  const magicByte = decoder.readInt8(); // eslint-disable-line no-unused-vars

  // The library is currently not performing CRC validations
  const crc = decoder.readInt32(); // eslint-disable-line no-unused-vars

  const attributes = decoder.readInt16();
  const lastOffsetDelta = decoder.readInt32();
  const firstTimestamp = decoder.readInt64().toString();
  const maxTimestamp = decoder.readInt64().toString();
  const producerId = decoder.readInt64().toString();
  const producerEpoch = decoder.readInt16();
  const firstSequence = decoder.readInt32();

  const inTransaction = (attributes & TRANSACTIONAL_FLAG_MASK) > 0;
  const isControlBatch = (attributes & CONTROL_FLAG_MASK) > 0;
  const timestampType =
    (attributes & TIMESTAMP_TYPE_FLAG_MASK) > 0
      ? TimestampTypes.LOG_APPEND_TIME
      : TimestampTypes.CREATE_TIME;

  const codec = lookupCodecByAttributes(attributes);

  const recordContext = {
    firstOffset,
    firstTimestamp,
    partitionLeaderEpoch,
    inTransaction,
    isControlBatch,
    lastOffsetDelta,
    producerId,
    producerEpoch,
    firstSequence,
    maxTimestamp,
    timestampType,
  };

  const records = await decodeRecords(codec, decoder, {
    ...recordContext,
    magicByte,
  });

  return {
    ...recordContext,
    records,
  };
};

const decodeRecords = async (
  codec: any,
  recordsDecoder: any,
  recordContext: any
) => {
  if (!codec) {
    return recordsDecoder.readArray((decoder: any) =>
      decodeRecord(decoder, recordContext)
    );
  }

  const length = recordsDecoder.readInt32();

  if (length <= 0) {
    return [];
  }

  const compressedRecordsBuffer = recordsDecoder.readAll();
  const decompressedRecordBuffer = await codec.decompress(
    compressedRecordsBuffer
  );
  const decompressedRecordDecoder = new Decoder(decompressedRecordBuffer);
  const records = new Array(length);

  for (let i = 0; i < length; i++) {
    records[i] = decodeRecord(decompressedRecordDecoder, recordContext);
  }

  return records;
};

const decodeRecord = (decoder: any, recordContext: any) => {
  const recordBuffer = decoder.readVarIntBytes();
  return RecordDecoder(new Decoder(recordBuffer), recordContext);
};
