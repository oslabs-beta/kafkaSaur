/** @format */

import Decoder from '../../../decoder.ts';
import { failIfVersionNotSupported } from '../../../error.ts';
import { parse as parseV0 } from '../v0/response.ts';

/**
 * Heartbeat Response (Version: 1) => throttle_time_ms error_code
 *   throttle_time_ms => INT32
 *   error_code => INT16
 */

const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData);
  const throttleTime = decoder.readInt32();
  const errorCode = decoder.readInt16();

  failIfVersionNotSupported(errorCode);

  return { throttleTime, errorCode };
};

export default { decode, parse };
