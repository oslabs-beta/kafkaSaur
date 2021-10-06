import {Decoder} from '../../../decoder.ts'
import parse from '../v0/response.ts'



/**
 * CreateTopics Response (Version: 1) => [topic_errors]
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
    topicErrors: decoder.readArray(topicErrors).sort(topicNameComparator),
  }
}

export default {
  decode,
  parse
}
