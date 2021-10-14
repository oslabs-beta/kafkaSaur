import response from '../v2/response.ts'
const parse = response.parse
const decode = response.decode
/**
 * SyncGroup Response (Version: 2) => throttle_time_ms error_code member_assignment
 *   throttle_time_ms => INT32
 *   error_code => INT16
 *   member_assignment => BYTES
 */
export default{
  decode,
  parse,
}
