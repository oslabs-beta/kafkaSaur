// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'failIfVers... Remove this comment to see the full error message
const { failIfVersionNotSupported, failure, createErrorFromCode } = require('../../../error')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseV2'.
const { parse: parseV2 } = require('../v2/response')

/**
 * LeaveGroup Response (Version: 3) => throttle_time_ms error_code [members]
 *   throttle_time_ms => INT32
 *   error_code => INT16
 *   members => member_id group_instance_id error_code
 *     member_id => STRING
 *     group_instance_id => NULLABLE_STRING
 *     error_code => INT16
 */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const throttleTime = decoder.readInt32()
  const errorCode = decoder.readInt16()
  const members = decoder.readArray(decodeMembers)

  failIfVersionNotSupported(errorCode)

  return { throttleTime: 0, clientSideThrottleTime: throttleTime, errorCode, members }
}

const decodeMembers = (decoder: any) => ({
  memberId: decoder.readString(),
  groupInstanceId: decoder.readString(),
  errorCode: decoder.readInt16()
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parse'.
const parse = async (data: any) => {
  const parsed = parseV2(data)

  const memberWithError = data.members.find((member: any) => failure(member.errorCode))
  if (memberWithError) {
    throw createErrorFromCode(memberWithError.errorCode)
  }

  return parsed
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export {
  decode,
  parse,
}
