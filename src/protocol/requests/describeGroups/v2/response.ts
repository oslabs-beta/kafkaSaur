// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parse'.
const { parse, decode: decodeV1 } = require('../v1/response')

/**
 * Starting in version 2, on quota violation, brokers send out responses before throttling.
 * @see https://cwiki.apache.org/confluence/display/KAFKA/KIP-219+-+Improve+quota+communication
 *
 * DescribeGroups Response (Version: 2) => throttle_time_ms [groups]
 *   throttle_time_ms => INT32
 *   groups => error_code group_id state protocol_type protocol [members]
 *     error_code => INT16
 *     group_id => STRING
 *     state => STRING
 *     protocol_type => STRING
 *     protocol => STRING
 *     members => member_id client_id client_host member_metadata member_assignment
 *       member_id => STRING
 *       client_id => STRING
 *       client_host => STRING
 *       member_metadata => BYTES
 *       member_assignment => BYTES
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
export {
  decode,
  parse,
}
