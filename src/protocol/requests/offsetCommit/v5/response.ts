/** @format */

import response from '../v4/response.ts';

const parse = response.parse;
const decode = response.decode;

/**
 * OffsetCommit Response (Version: 5) => throttle_time_ms [responses]
 *   throttle_time_ms => INT32
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition error_code
 *       partition => INT32
 *       error_code => INT16
 */
export default {
  decode,
  parse,
};
