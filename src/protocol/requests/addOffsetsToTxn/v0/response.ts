/** @format */

import {Decoder} from '../../../decoder.ts';

import {
  failure,
  createErrorFromCode,
  failIfVersionNotSupported,
} from '../../../error.ts';

/**
 * AddOffsetsToTxn Response (Version: 0) => throttle_time_ms error_code
 *   throttle_time_ms => INT32
 *   error_code => INT16
 */

const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData);
  const throttleTime = decoder.readInt32();
  const errorCode = decoder.readInt16();

  failIfVersionNotSupported(errorCode);

  return {
    throttleTime,
    errorCode,
  };
};

const parse = async (data: any) => {
  if (failure(data.errorCode)) {
    throw createErrorFromCode(data.errorCode);
  }

  return data;
};

export default { decode, parse };
