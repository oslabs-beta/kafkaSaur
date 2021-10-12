/** @format */

import {Decoder} from '../../../decoder.ts';
import {
  failIfVersionNotSupported,
  failure,
  createErrorFromCode,
} from '../../../error.ts';
import response from '../v2/response.ts';

const parseV2 = response.parse;
/**
 * LeaveGroup Response (Version: 3) => throttle_time_ms error_code [members]
 *   throttle_time_ms => INT32
 *   error_code => INT16
 *   members => member_id group_instance_id error_code
 *     member_id => STRING
 *     group_instance_id => NULLABLE_STRING
 *     error_code => INT16
 */
//
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData);
  const throttleTime = decoder.readInt32();
  const errorCode = decoder.readInt16();
  const members = decoder.readArray(decodeMembers);

  failIfVersionNotSupported(errorCode);

  return {
    throttleTime: 0,
    clientSideThrottleTime: throttleTime,
    errorCode,
    members,
  };
};

const decodeMembers = (decoder: any) => ({
  memberId: decoder.readString(),
  groupInstanceId: decoder.readString(),
  errorCode: decoder.readInt16(),
});
//deno-lint-ignore require-await
const parse = async (data: any) => {
  const parsed = parseV2(data);

  const memberWithError = data.members.find((member: any) =>
    failure(member.errorCode)
  );
  if (memberWithError) {
    throw createErrorFromCode(memberWithError.errorCode);
  }

  return parsed;
};

export default {
  decode,
  parse,
};
