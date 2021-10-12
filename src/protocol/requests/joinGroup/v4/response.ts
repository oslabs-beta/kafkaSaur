/** @format */

import response from '../v3/response.ts';
import { KafkaJSMemberIdRequired } from '../../../../errors.ts';
import { failure, createErrorFromCode, errorCodes } from '../../../error.ts';

const decode = response.decode;
/**
 * JoinGroup Response (Version: 4) => throttle_time_ms error_code generation_id group_protocol leader_id member_id [members]
 *   throttle_time_ms => INT32
 *   error_code => INT16
 *   generation_id => INT32
 *   group_protocol => STRING
 *   leader_id => STRING
 *   member_id => STRING
 *   members => member_id member_metadata
 *     member_id => STRING
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

export default {
  decode,
  parse,
};
