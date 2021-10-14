import {Encoder} from '../../../encoder.ts'
import apiKeys from '../../apiKeys.ts'

const apiKey = apiKeys.Metadata;

/**
 * Metadata Request (Version: 0) => [topics]
 *   topics => STRING
 */

export default ({
  topics
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'Metadata',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder().writeArray(topics)
  },
})
