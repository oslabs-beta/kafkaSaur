/** @format */

import { Decoder } from '../../../decoder.ts';
import { failure, createErrorFromCode } from '../../../error.ts';
import flatten from '../../../../utils/flatten.ts';
import { Buffer } from 'https://deno.land/std@0.110.0/node/buffer.ts';

/**
 * OffsetCommit Response (Version: 0) => [responses]
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition error_code
 *       partition => INT32
 *       error_code => INT16
 */
//deno-lint-ignore require-await
const decode = async (rawData: Buffer) => {
  const decoder = new Decoder(rawData);
  return {
    responses: decoder.readArray(decodeResponses),
  };
};

const decodeResponses = (decoder: Decoder) => ({
  topic: decoder.readString(),
  partitions: decoder.readArray(decodePartitions),
});

const decodePartitions = (decoder: Decoder) => ({
  partition: decoder.readInt32(),
  errorCode: decoder.readInt16(),
});
//deno-lint-ignore require-await
const parse = async (data: any) => {
  const partitionsWithError = data.responses.map((response: any) =>
    response.partitions.filter((partition: any) => failure(partition.errorCode))
  );
  const partitionWithError: Record<any, any> = flatten(partitionsWithError)[0];
  if (partitionWithError) {
    throw createErrorFromCode(partitionWithError.errorCode);
  }

  return data;
};

export default {
  decode,
  parse,
};
