// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parse'.
const { parse, decode: decodeV1 } = require('../v0/response')

/**
 * In version 1, on quota violation, brokers send out responses before throttling.
 * @see https://cwiki.apache.org/confluence/display/KAFKA/KIP-219+-+Improve+quota+communication
 *
 * TxnOffsetCommit Response (Version: 1) => throttle_time_ms [topics]
 *   throttle_time_ms => INT32
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition error_code
 *       partition => INT32
 *       error_code => INT16
 */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const decode = async (rawData: any) => {
  const decoded = await decodeV1(rawData)

  return {
    ...decoded,
    throttleTime: 0,
    clientSideThrottleTime: decoded.throttleTime,
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  decode,
  parse,
}
