import response from '../v0/response.ts'

const parse = response.parse
const decode = response.decode

/**
 * OffsetCommit Response (Version: 1) => [responses]
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition error_code
 *       partition => INT32
 *       error_code => INT16
 */

export default {
  decode,
  parse,
}
