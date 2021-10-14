import {Decoder} from '../../../decoder.ts'
import { failure, createErrorFromCode } from '../../../error.ts'
import { KafkaJSAggregateError, KafkaJSCreateTopicError } from '../../../../errors.ts'

/**
 * CreateTopics Response (Version: 0) => [topic_errors]
 *   topic_errors => topic error_code
 *     topic => STRING
 *     error_code => INT16
 */

const topicNameComparator = (a: any, b: any) => a.topic.localeCompare(b.topic)

const topicErrors = (decoder: any) => ({
  topic: decoder.readString(),
  errorCode: decoder.readInt16()
})
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  return {
    topicErrors: decoder.readArray(topicErrors).sort(topicNameComparator),
  }
}
//deno-lint-ignore require-await
const parse = async (data: any) => {
  const topicsWithError = data.topicErrors.filter(({
    errorCode
  }: any) => failure(errorCode))
  if (topicsWithError.length > 0) {
    throw new KafkaJSAggregateError(
      'Topic creation errors',
      topicsWithError.map(
        (error: any) => new KafkaJSCreateTopicError(createErrorFromCode(error.errorCode), error.topic)
      )
    )
  }

  return data
}

export default {
  decode,
  parse,
}
