/** @format */

import { Decoder } from '../../../decoder.ts';
import {
  failure,
  createErrorFromCode,
  failIfVersionNotSupported,
} from '../../../error.ts';

/**
 * InitProducerId Response (Version: 0) => throttle_time_ms error_code producer_id producer_epoch
 *   throttle_time_ms => INT32
 *   error_code => INT16
 *   producer_id => INT64
 *   producer_epoch => INT16
 */
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData);
  const throttleTime = decoder.readInt32();
  const errorCode = decoder.readInt16();

  failIfVersionNotSupported(errorCode);

  return {
    throttleTime,
    errorCode,
    producerId: decoder.readInt64().toString(),
    producerEpoch: decoder.readInt16(),
  };
};
//deno-lint-ignore require-await
const parse = async (data: any) => {
  if (failure(data.errorCode)) {
    throw createErrorFromCode(data.errorCode);
  }

  return data;
};

export default { decode, parse };
