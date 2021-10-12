import { Decoder } from '../../../decoder.ts'
import { failIfVersionNotSupported } from '../../../error.ts'
import response from '../v0/response.ts'

const { parse } = response;

/**
 * SyncGroup Response (Version: 1) => throttle_time_ms error_code member_assignment
 *   throttle_time_ms => INT32
 *   error_code => INT16
 *   member_assignment => BYTES
 */
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const throttleTime = decoder.readInt32()
  const errorCode = decoder.readInt16()

  failIfVersionNotSupported(errorCode)

  return {
    throttleTime,
    errorCode,
    memberAssignment: decoder.readBytes(),
  }
}

export default {
  decode,
  parse
}
