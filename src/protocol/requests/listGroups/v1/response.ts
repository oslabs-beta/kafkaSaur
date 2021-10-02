/** @format */

import responseV0 from '../v0/response.ts';

import Decoder from '../../../decoder.ts';

/**
 * ListGroups Response (Version: 1) => error_code [groups]
 *   throttle_time_ms => INT32
 *   error_code => INT16
 *   groups => group_id protocol_type
 *     group_id => STRING
 *     protocol_type => STRING
 */

const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData);
  const throttleTime = decoder.readInt32();
  const errorCode = decoder.readInt16();
  const groups = decoder.readArray(responseV0.decodeGroup);

  return {
    throttleTime,
    errorCode,
    groups,
  };
};

export default {
  decode,
  parse: responseV0.parse,
};
