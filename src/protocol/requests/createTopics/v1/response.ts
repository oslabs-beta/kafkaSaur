// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseV0'.
const { parse: parseV0 } = require('../v0/response')

/**
 * CreateTopics Response (Version: 1) => [topic_errors]
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
  return {
    topicErrors: decoder.readArray(topicErrors).sort(topicNameComparator),
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export {
  decode,
  parse: parseV0,
}
