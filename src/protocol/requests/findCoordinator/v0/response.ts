/** @format */

import { Decoder } from '../../../decoder.ts';
import {
  failure,
  createErrorFromCode,
  failIfVersionNotSupported,
} from '../../../error.ts';
import { Buffer } from 'https://deno.land/std@0.110.0/node/buffer.ts';

/**
 * FindCoordinator Response (Version: 0) => error_code coordinator
 *  error_code => INT16
 *  coordinator => node_id host port
 *    node_id => INT32
 *    host => STRING
 *    port => INT32
 */
//deno-lint-ignore require-await
const decode = async (rawData: Buffer) => {
  const decoder = new Decoder(rawData);
  const errorCode = decoder.readInt16();

  failIfVersionNotSupported(errorCode);

  const coordinator = {
    nodeId: decoder.readInt32(),
    host: decoder.readString(),
    port: decoder.readInt32(),
  };

  return {
    errorCode,
    coordinator,
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
  decode,
  parse,
};
