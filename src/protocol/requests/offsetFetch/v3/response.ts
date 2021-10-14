import {Decoder} from '../../../decoder.ts'
import response from '../v2/response.ts'

const parseV2 = response.parse;

/**
 * OffsetFetch Response (Version: 3) => throttle_time_ms [responses] error_code
 *   throttle_time_ms => INT32
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition offset metadata error_code
 *       partition => INT32
 *       offset => INT64
 *       metadata => NULLABLE_STRING
 *       error_code => INT16
 *   error_code => INT16
 */
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  return {
    throttleTime: decoder.readInt32(),
    responses: decoder.readArray(decodeResponses),
    errorCode: decoder.readInt16(),
  }
}

const decodeResponses = (decoder: any) => ({
  topic: decoder.readString(),
  partitions: decoder.readArray(decodePartitions)
})

const decodePartitions = (decoder: any) => ({
  partition: decoder.readInt32(),
  offset: decoder.readInt64().toString(),
  metadata: decoder.readString(),
  errorCode: decoder.readInt16()
})

export default {
  decode,
  parse: parseV2
}
