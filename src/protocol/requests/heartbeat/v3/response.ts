/** @format */

import response from '../v2/response.ts';

const parse = response.parse;
const decode = response.decode;

/**
 * Heartbeat Response (Version: 3) => throttle_time_ms error_code
 *   throttle_time_ms => INT32
 *   error_code => INT16
 */
export default {
  decode,
  parse,
};
