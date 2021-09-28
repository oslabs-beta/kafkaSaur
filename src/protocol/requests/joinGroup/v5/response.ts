// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSMem... Remove this comment to see the full error message
const { KafkaJSMemberIdRequired } = require('../../../../errors')
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'failure'.
  failure,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createErro... Remove this comment to see the full error message
  createErrorFromCode,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errorCodes... Remove this comment to see the full error message
  errorCodes,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'failIfVers... Remove this comment to see the full error message
  failIfVersionNotSupported,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../error')

/**
 * JoinGroup Response (Version: 5) => throttle_time_ms error_code generation_id group_protocol leader_id member_id [members]
 *   throttle_time_ms => INT32
 *   error_code => INT16
 *   generation_id => INT32
 *   group_protocol => STRING
 *   leader_id => STRING
 *   member_id => STRING
 *   members => member_id group_instance_id metadata
 *     member_id => STRING
 *     group_instance_id => NULLABLE_STRING
 *     member_metadata => BYTES
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MEMBER_ID_... Remove this comment to see the full error message
const { code: MEMBER_ID_REQUIRED_ERROR_CODE } = errorCodes.find(
  (e: any) => e.type === 'MEMBER_ID_REQUIRED'
)

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parse'.
const parse = async (data: any) => {
  if (failure(data.errorCode)) {
    if (data.errorCode === MEMBER_ID_REQUIRED_ERROR_CODE) {
      throw new KafkaJSMemberIdRequired(createErrorFromCode(data.errorCode), {
        memberId: data.memberId,
      })
    }

    throw createErrorFromCode(data.errorCode)
  }

  return data
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const throttleTime = decoder.readInt32()
  const errorCode = decoder.readInt16()

  failIfVersionNotSupported(errorCode)

  return {
    throttleTime: 0,
    clientSideThrottleTime: throttleTime,
    errorCode,
    generationId: decoder.readInt32(),
    groupProtocol: decoder.readString(),
    leaderId: decoder.readString(),
    memberId: decoder.readString(),
    members: decoder.readArray((decoder: any) => ({
      memberId: decoder.readString(),
      groupInstanceId: decoder.readString(),
      memberMetadata: decoder.readBytes()
    })),
  };
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  decode,
  parse,
}
