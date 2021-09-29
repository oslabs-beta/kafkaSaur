// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parse'.
const { parse, decode: decodeV2 } = require('../v2/response')

/**
 * Starting in version 3, on quota violation, brokers send out responses before throttling.
 * @see https://cwiki.apache.org/confluence/display/KAFKA/KIP-219+-+Improve+quota+communication
 *
 * CreateTopics Response (Version: 3) => throttle_time_ms [topic_errors]
 *   throttle_time_ms => INT32
 *   topic_errors => topic error_code error_message
 *     topic => STRING
 *     error_code => INT16
 *     error_message => NULLABLE_STRING
 */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const decode = async (rawData: any) => {
  const decoded = await decodeV2(rawData)

  return {
    ...decoded,
    throttleTime: 0,
    clientSideThrottleTime: decoded.throttleTime,
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export {
  decode,
  parse,
}
