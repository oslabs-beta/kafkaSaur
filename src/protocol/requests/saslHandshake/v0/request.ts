import { Encoder } from '../../../encoder.ts'
import apiKeys from '../../apiKeys.ts'

const apiKey = apiKeys.SaslHandshake;

/**
 * SaslHandshake Request (Version: 0) => mechanism
 *    mechanism => STRING
 */

/**
 * @param {string} mechanism - SASL Mechanism chosen by the client
 */
export default ({
 mechanism
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'SaslHandshake',
  //deno-lint-ignore require-await
  encode: async () => new Encoder().writeString(mechanism),
})
