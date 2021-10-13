/** @format */
import { Buffer } from 'https://deno.land/std@0.110.0/node/buffer.ts';
import { Decoder } from '../../../decoder.ts';
import { failure, createErrorFromCode } from '../../../error.ts';

/**
 * TxnOffsetCommit Response (Version: 0) => throttle_time_ms [topics]
 *   throttle_time_ms => INT32
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition error_code
 *       partition => INT32
 *       error_code => INT16
 */
const decode = async (rawData: Buffer) => {
  const decoder = new Decoder(rawData);
  const throttleTime = decoder.readInt32();
  const topics = await decoder.readArrayAsync(decodeTopic);

  return {
    throttleTime,
    topics,
  };
};

const decodeTopic = async (decoder: any) => ({
  topic: decoder.readString(),
  partitions: await decoder.readArrayAsync(decodePartition),
});

const decodePartition = (decoder: Decoder) => ({
  partition: decoder.readInt32(),
  errorCode: decoder.readInt16(),
});
//deno-lint-ignore require-await
const parse = async (data: any) => {
  const topicsWithErrors = data.topics
    .map(({ partitions }: any) => ({
      partitionsWithErrors: partitions.filter(({ errorCode }: any) =>
        failure(errorCode)
      ),
    }))
    .filter(({ partitionsWithErrors }: any) => partitionsWithErrors.length);

  if (topicsWithErrors.length > 0) {
    throw createErrorFromCode(
      topicsWithErrors[0].partitionsWithErrors[0].errorCode
    );
  }

  return data;
};

export default {
  decode,
  parse,
};
