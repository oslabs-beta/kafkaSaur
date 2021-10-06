import {Decoder} from '../../../decoder.ts'
import {Encoder} from '../../../encoder.ts'
import response from '../v0/response.ts'
import { failIfVersionNotSupported } from '../../../error.ts'

const parseV0 = response.parse;
/**
 * SaslAuthenticate Response (Version: 1) => error_code error_message sasl_auth_bytes
 *   error_code => INT16
 *   error_message => NULLABLE_STRING
 *   sasl_auth_bytes => BYTES
 *   session_lifetime_ms => INT64
 */
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const errorCode = decoder.readInt16()

  failIfVersionNotSupported(errorCode)
  const errorMessage = decoder.readString()

  // This is necessary to make the response compatible with the original
  // mechanism protocols. They expect a byte response, which starts with
  // the size
  const authBytesEncoder = new Encoder().writeBytes(decoder.readBytes())
  const authBytes = authBytesEncoder.buffer
  const sessionLifetimeMs = decoder.readInt64().toString()

  return {
    errorCode,
    errorMessage,
    authBytes,
    sessionLifetimeMs,
  }
}
export default{
  decode,
  parseV0,
}
