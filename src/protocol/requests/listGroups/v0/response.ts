/** @format */

import { Decoder } from '../../../decoder.ts';
import { failure, createErrorFromCode } from '../../../error.ts';

/**
 * ListGroups Response (Version: 0) => error_code [groups]
 *   error_code => INT16
 *   groups => group_id protocol_type
 *     group_id => STRING
 *     protocol_type => STRING
 */

const decodeGroup = (decoder: any) => ({
  groupId: decoder.readString(),
  protocolType: decoder.readString(),
});
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData);
  const errorCode = decoder.readInt16();
  const groups = decoder.readArray(decodeGroup);

  return {
    errorCode,
    groups,
  };
};
//deno-lint-ignore require-await
const parse = async (data: any) => {
  if (failure(data.errorCode)) {
    throw createErrorFromCode(data.errorCode);
  }

  return data;
};

export default {
  decodeGroup,
  decode,
  parse,
};
