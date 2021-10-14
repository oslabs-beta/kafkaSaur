import {Decoder} from '../../../decoder.ts';
import { failure,createErrorFromCode } from '../../../error.ts';

/*
 * CreatePartitions Response (Version: 0) => throttle_time_ms [topic_errors]
 *   throttle_time_ms => INT32
 *   topic_errors => topic error_code error_message
 *     topic => STRING
 *     error_code => INT16
 *     error_message => NULLABLE_STRING
 */

const topicNameComparator = (a: any, b: any) => a.topic.localeCompare(b.topic)

const topicErrors = (decoder: any) => ({
  topic: decoder.readString(),
  errorCode: decoder.readInt16(),
  errorMessage: decoder.readString()
})
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const throttleTime = decoder.readInt32()
  return {
    throttleTime,
    topicErrors: decoder.readArray(topicErrors).sort(topicNameComparator),
  }
}
//deno-lint-ignore require-await
const parse = async (data: any) => {
  const topicsWithError = data.topicErrors.filter(({
    errorCode
  }: any) => failure(errorCode))
  if (topicsWithError.length > 0) {
    throw createErrorFromCode(topicsWithError[0].errorCode)
  }

  return data
}

export default {
  decode,
  parse,
}
