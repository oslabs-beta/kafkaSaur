/** @format */

import { Decoder } from '../../../decoder.ts';
import { KafkaJSMemberIdRequired } from '../../../../errors.ts';
import {
  failure,
  createErrorFromCode,
  errorCodes,
  failIfVersionNotSupported,
} from '../../../error.ts';

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
const { code: MEMBER_ID_REQUIRED_ERROR_CODE } = errorCodes.find(
  (e: any) => e.type === 'MEMBER_ID_REQUIRED'
) as any;
//deno-lint-ignore require-await
const parse = async (data: any) => {
  if (failure(data.errorCode)) {
    if (data.errorCode === MEMBER_ID_REQUIRED_ERROR_CODE) {
      throw new KafkaJSMemberIdRequired(createErrorFromCode(data.errorCode), {
        memberId: data.memberId,
      });
    }

    throw createErrorFromCode(data.errorCode);
  }

  return data;
};
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData);
  const throttleTime = decoder.readInt32();
  const errorCode = decoder.readInt16();

  failIfVersionNotSupported(errorCode);

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
      memberMetadata: decoder.readBytes(),
    })),
  };
};

export default { decode, parse };
