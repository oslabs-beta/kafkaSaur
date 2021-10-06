import {Decoder} from '../../../decoder.ts';
import { failure, createErrorFromCode } from '../../../error.ts'
/**
 * DeleteGroups Response (Version: 0) => throttle_time_ms [results]
 *  throttle_time_ms => INT32
 *  results => group_id error_code
 *    group_id => STRING
 *    error_code => INT16
 */

const decodeGroup = (decoder: any) => ({
  groupId: decoder.readString(),
  errorCode: decoder.readInt16()
})
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const throttleTimeMs = decoder.readInt32()
  const results = decoder.readArray(decodeGroup)

  for (const result of results) {
    if (failure(result.errorCode)) {
      result.error = createErrorFromCode(result.errorCode)
    }
  }
  return {
    throttleTimeMs,
    results,
  }
}
//deno-lint-ignore require-await
const parse = async (data: any) => {
  return data
}

export default {
  decode,
  parse,
}
