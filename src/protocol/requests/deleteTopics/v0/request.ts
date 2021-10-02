import {Encoder} from '../../../encoder.ts'

import apiKeys from '../../apiKeys.ts'
const apiKey = apiKeys.DeleteTopics
/**
 * DeleteTopics Request (Version: 0) => [topics] timeout
 *   topics => STRING
 *   timeout => INT32
 */
export default ({
  topics,
  timeout = 5000
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'DeleteTopics',
  encode: async () => {
    return new Encoder().writeArray(topics).writeInt32(timeout)
  },
})
