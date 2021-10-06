/** @format */

import { Decoder } from '../../../decoder.ts';
import response from '../v0/response.ts';
const parseV0 = response.parse;
/**
 * OffsetCommit Response (Version: 3) => throttle_time_ms [responses]
 *   throttle_time_ms => INT32
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition error_code
 *       partition => INT32
 *       error_code => INT16
 */
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData);
  return {
    throttleTime: decoder.readInt32(),
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
});

export default {
  decode,
  parse: parseV0,
};
