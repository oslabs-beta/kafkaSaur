import {Decoder} from '../../../decoder.ts'
import { failure, createErrorFromCode } from '../../../error.ts'
import flatten from '../../../../utils/flatten.ts'

/**
 * Produce Response (Version: 3) => [responses] throttle_time_ms
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition error_code base_offset log_append_time
 *       partition => INT32
 *       error_code => INT16
 *       base_offset => INT64
 *       log_append_time => INT64
 *   throttle_time_ms => INT32
 */

const partition = (decoder: any) => ({
  partition: decoder.readInt32(),
  errorCode: decoder.readInt16(),
  baseOffset: decoder.readInt64().toString(),
  logAppendTime: decoder.readInt64().toString()
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
//deno-lint-ignore require-await
const parse = async (data: any) => {
  const partitionsWithError = data.topics.map((response: any) => {
    return response.partitions.filter((partition: any) => failure(partition.errorCode));
  })

  const errors = flatten(partitionsWithError)
  if (errors.length > 0) {
    const { errorCode } = errors[0]
    throw createErrorFromCode(errorCode)
  }

  return data
}

export default{
  decode,
  parse,
}
