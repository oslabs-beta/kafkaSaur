import { Encoder } from '../../../encoder.ts'
import apiKeys from '../../apiKeys.ts'
const apiKey = apiKeys.SaslAuthenticate;
/**
 * SaslAuthenticate Request (Version: 0) => sasl_auth_bytes
 *   sasl_auth_bytes => BYTES
 */

/**
 * @param {Buffer} authBytes - SASL authentication bytes from client as defined by the SASL mechanism
 */
export default ({
 authBytes
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'SaslAuthenticate',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder().writeBuffer(authBytes)
  },
})
