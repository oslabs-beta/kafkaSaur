// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSDel... Remove this comment to see the full error message
const { KafkaJSDeleteTopicRecordsError } = require('../../../../errors')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'failure'.
const { failure, createErrorFromCode } = require('../../../error')

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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'topicNameC... Remove this comment to see the full error message
const topicNameComparator = (a: any, b: any) => a.topic.localeCompare(b.topic)

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parse'.
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

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
  topics
}: any) => ({
  decode,
  parse: parse(topics),
})
