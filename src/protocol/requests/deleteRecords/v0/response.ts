import {Decoder} from '../../../decoder.ts'
import { KafkaJSDeleteTopicRecordsError } from '../../../../errors.ts'
import { failure, createErrorFromCode } from '../../../error.ts'

/**
 * DeleteRecords Response (Version: 0) => throttle_time_ms [topics]
 *  throttle_time_ms => INT32
 *  topics => name [partitions]
 *    name => STRING
 *    partitions => partition low_watermark error_code
 *      partition => INT32
 *      low_watermark => INT64
 *      error_code => INT16
 */

const topicNameComparator = (a: any, b: any) => a.topic.localeCompare(b.topic)
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  return {
    throttleTime: decoder.readInt32(),
    topics: decoder
      .readArray((decoder: any) => ({
      topic: decoder.readString(),

      partitions: decoder.readArray((decoder: any) => ({
        partition: decoder.readInt32(),
        lowWatermark: decoder.readInt64(),
        errorCode: decoder.readInt16()
      }))
    }))
      .sort(topicNameComparator),
  };
}

const parse = (requestTopics: any) => async (data: any) => {
  const topicsWithErrors = data.topics
    .map(({
    partitions
  }: any) => ({
      partitionsWithErrors: partitions.filter(({
        errorCode
      }: any) => failure(errorCode)),
    }))
    .filter(({
    partitionsWithErrors
  }: any) => partitionsWithErrors.length)

  if (topicsWithErrors.length > 0) {
    // at present we only ever request one topic at a time, so can destructure the arrays
    const [{ topic }] = data.topics // topic name
    const [{ partitions: requestPartitions }] = requestTopics // requested offset(s)
    const [{ partitionsWithErrors }] = topicsWithErrors // partition(s) + error(s)

    throw new KafkaJSDeleteTopicRecordsError({
      topic,
      partitions: partitionsWithErrors.map(({
        partition,
        errorCode
      }: any) => ({
        partition,
        error: createErrorFromCode(errorCode),
        // attach the original offset from the request, onto the error response
        offset: requestPartitions.find((p: any) => p.partition === partition).offset,
      })),
    })
  }

  return data
}

export default({
  topics
}: any) => ({
  decode,
  parse: parse(topics),
})
