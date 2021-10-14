/** @format */

import { Decoder } from '../../../decoder.ts';
import { Encoder } from '../../../encoder.ts';
import {
  failure,
  createErrorFromCode,
  failIfVersionNotSupported,
  errorCodes,
} from '../../../error.ts';

import { KafkaJSProtocolError } from '../../../../errors.ts';

const SASL_AUTHENTICATION_FAILED = 58;
const protocolAuthError = errorCodes.find(
  (e: any) => e.code === SASL_AUTHENTICATION_FAILED
);

/**
 * SaslAuthenticate Response (Version: 0) => error_code error_message sasl_auth_bytes
 *   error_code => INT16
 *   error_message => NULLABLE_STRING
 *   sasl_auth_bytes => BYTES
 */
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData);
  const errorCode = decoder.readInt16();

  failIfVersionNotSupported(errorCode);
  const errorMessage = decoder.readString();

  // This is necessary to make the response compatible with the original
  // mechanism protocols. They expect a byte response, which starts with
  // the size
  const authBytesEncoder = new Encoder().writeBytes(decoder.readBytes());
  const authBytes = authBytesEncoder.buffer;

  return {
    errorCode,
    errorMessage,
    authBytes,
  };
};
//deno-lint-ignore require-await
const parse = async (data: any) => {
  if (data.errorCode === SASL_AUTHENTICATION_FAILED && data.errorMessage) {
    throw new KafkaJSProtocolError({
      ...protocolAuthError,
      message: data.errorMessage,
    });
  }

  if (failure(data.errorCode)) {
    throw createErrorFromCode(data.errorCode);
  }

  return data;
};

export default {
  decode,
  parse,
};
