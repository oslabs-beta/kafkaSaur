/** @format */

import {Decoder} from '../../../decoder.ts';
import {
  failure,
  createErrorFromCode,
  failIfVersionNotSupported,
} from '../../../error.ts';

/**
 * LeaveGroup Response (Version: 0) => error_code
 *   error_code => INT16
 */
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData);
  const errorCode = decoder.readInt16();

  failIfVersionNotSupported(errorCode);

  return { errorCode };
};
//deno-lint-ignore require-await
const parse = async (data: any) => {
  if (failure(data.errorCode)) {
    throw createErrorFromCode(data.errorCode);
  }

  return data;
};

export default {
  decode,
  parse,
};
