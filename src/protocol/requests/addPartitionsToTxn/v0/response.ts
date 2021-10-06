/** @format */

import {Decoder }from '../../../decoder.ts';

import { failure, createErrorFromCode } from '../../../error.ts';

/**
 * AddPartitionsToTxn Response (Version: 0) => throttle_time_ms [errors]
 *   throttle_time_ms => INT32
 *   errors => topic [partition_errors]
 *     topic => STRING
 *     partition_errors => partition error_code
 *       partition => INT32
 *       error_code => INT16
 */
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData);
  const throttleTime = decoder.readInt32();
  const errors = await decoder.readArrayAsync(decodeError);

  return {
    throttleTime,
    errors,
  };
};

const decodeError = async (decoder: any) => ({
  topic: decoder.readString(),
  partitionErrors: await decoder.readArrayAsync(decodePartitionError),
});

const decodePartitionError = (decoder: any) => ({
  partition: decoder.readInt32(),
  errorCode: decoder.readInt16(),
});
//deno-lint-ignore require-await
const parse = async (data: any) => {
  const topicsWithErrors = data.errors
    .map(({ partitionErrors }: any) => ({
      partitionsWithErrors: partitionErrors.filter(({ errorCode }: any) =>
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

export default{ decode, parse };
