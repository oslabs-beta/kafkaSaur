/** @format */

import { Decoder } from '../../../decoder.ts';
import { failure, createErrorFromCode } from '../../../error.ts';
import flatten from '../../../../utils/flatten.ts';

/**
 * Offsets Response (Version: 0) => [responses]
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition error_code [offsets]
 *       partition => INT32
 *       error_code => INT16
 *       offsets => INT64
 */
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData);
  return {
    responses: decoder.readArray(decodeResponses),
  };
};

const decodeResponses = (decoder: any) => ({
  topic: decoder.readString(),
  partitions: decoder.readArray(decodePartitions),
});

const decodePartitions = (decoder: any) => ({
  partition: decoder.readInt32(),
  errorCode: decoder.readInt16(),
  offsets: decoder.readArray(decodeOffsets),
});

const decodeOffsets = (decoder: any) => decoder.readInt64().toString();
//deno-lint-ignore require-await
const parse = async (data: any) => {
  const partitionsWithError =  data.responses.map((response: any) =>
    response.partitions.filter((partition: any) => failure(partition.errorCode))
  );
  const partitionWithError =   flatten(partitionsWithError)[0];
  if (partitionWithError) {
    throw createErrorFromCode(partitionWithError);
  }

  return data;
};

export default { decode, parse };
