/** @format */
import {Buffer} from 'https://deno.land/std@0.110.0/node/buffer.ts'
import responseV0 from '../v0/response.ts';

import {Decoder }from '../../../decoder.ts';

/**
 * ListGroups Response (Version: 1) => error_code [groups]
 *   throttle_time_ms => INT32
 *   error_code => INT16
 *   groups => group_id protocol_type
 *     group_id => STRING
 *     protocol_type => STRING
 */

//deno-lint-ignore require-await
const decode = async (rawData: Buffer) => {
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
