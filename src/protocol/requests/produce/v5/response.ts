import { Decoder } from '../../../decoder.ts'
import response  from '../v3/response.ts'

const {parse} = response;


/**
 * Produce Response (Version: 5) => [responses] throttle_time_ms
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition error_code base_offset log_append_time log_start_offset
 *       partition => INT32
 *       error_code => INT16
 *       base_offset => INT64
 *       log_append_time => INT64
 *       log_start_offset => INT64
 *   throttle_time_ms => INT32
 */

const partition = (decoder: any) => ({
  partition: decoder.readInt32(),
  errorCode: decoder.readInt16(),
  baseOffset: decoder.readInt64().toString(),
  logAppendTime: decoder.readInt64().toString(),
  logStartOffset: decoder.readInt64().toString()
})
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const topics = decoder.readArray((decoder: any) => ({
    topicName: decoder.readString(),
    partitions: decoder.readArray(partition)
  }))

  const throttleTime = decoder.readInt32()

  return {
    topics,
    throttleTime,
  }
}

export default {
  decode,
  parse
}
