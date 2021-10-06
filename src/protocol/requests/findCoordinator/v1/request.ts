import {Encoder} from '../../../encoder.ts'
import apiKeys from '../../apiKeys.ts'

const apiKey = apiKeys.GroupCoordinator;

/**
 * FindCoordinator Request (Version: 1) => coordinator_key coordinator_type
 *   coordinator_key => STRING
 *   coordinator_type => INT8
 */

export default ({
  coordinatorKey,
  coordinatorType
}: any) => ({
  apiKey,
  apiVersion: 1,
  apiName: 'GroupCoordinator',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder().writeString(coordinatorKey).writeInt8(coordinatorType)
  },
})
