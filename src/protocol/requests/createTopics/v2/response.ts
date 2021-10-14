import {Decoder} from '../../../decoder.ts'
import  parse  from '../v1/response.ts'
const  parseV1  = parse.parse
/**
 * CreateTopics Response (Version: 2) => throttle_time_ms [topic_errors]
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
  return {
    throttleTime: decoder.readInt32(),
    topicErrors: decoder.readArray(topicErrors).sort(topicNameComparator),
  }
}

export default {
  decode,
  parse: parseV1,
}
