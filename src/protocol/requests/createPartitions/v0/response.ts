// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'failure'.
const { failure, createErrorFromCode } = require('../../../error')

/*
 * CreatePartitions Response (Version: 0) => throttle_time_ms [topic_errors]
 *   throttle_time_ms => INT32
 *   topic_errors => topic error_code error_message
 *     topic => STRING
 *     error_code => INT16
 *     error_message => NULLABLE_STRING
 */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'topicNameC... Remove this comment to see the full error message
const topicNameComparator = (a: any, b: any) => a.topic.localeCompare(b.topic)

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'topicError... Remove this comment to see the full error message
const topicErrors = (decoder: any) => ({
  topic: decoder.readString(),
  errorCode: decoder.readInt16(),
  errorMessage: decoder.readString()
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const throttleTime = decoder.readInt32()
  return {
    throttleTime,
    topicErrors: decoder.readArray(topicErrors).sort(topicNameComparator),
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parse'.
const parse = async (data: any) => {
  const topicsWithError = data.topicErrors.filter(({
    errorCode
  }: any) => failure(errorCode))
  if (topicsWithError.length > 0) {
    throw createErrorFromCode(topicsWithError[0].errorCode)
  }

  return data
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export {
  decode,
  parse,
}
