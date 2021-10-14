/** @format */

import { Decoder } from '../../../decoder.ts';
import { failIfVersionNotSupported } from '../../../error.ts';
import response from '../v0/response.ts';

const parse = response.parse;

/**
 * JoinGroup Response (Version: 2) => throttle_time_ms error_code generation_id group_protocol leader_id member_id [members]
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
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData);
  const throttleTime = decoder.readInt32();
  const errorCode = decoder.readInt16();

  failIfVersionNotSupported(errorCode);

  return {
    throttleTime,
    errorCode,
    generationId: decoder.readInt32(),
    groupProtocol: decoder.readString(),
    leaderId: decoder.readString(),
    memberId: decoder.readString(),
    members: decoder.readArray((decoder: any) => ({
      memberId: decoder.readString(),
      memberMetadata: decoder.readBytes(),
    })),
  };
};

export default { decode, parse };
