/** @format */

import { Decoder } from '../../../decoder.ts';
import { failIfVersionNotSupported } from '../../../error.ts';
import response from '../v0/response.ts';

const parse = response.parse;

/**
 * LeaveGroup Response (Version: 1) => throttle_time_ms error_code
 *   throttle_time_ms => INT32
 *   error_code => INT16
 */
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData);
  const throttleTime = decoder.readInt32();
  const errorCode = decoder.readInt16();

  failIfVersionNotSupported(errorCode);

  return { throttleTime, errorCode };
};

export default {
  decode,
  parse,
};
