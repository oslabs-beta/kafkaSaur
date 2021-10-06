import {Encoder} from '../../../encoder.ts'
import apiKeys from '../../apiKeys.ts'

const apiKey = apiKeys.GroupCoordinator;

/**
 * FindCoordinator Request (Version: 0) => group_id
 *   group_id => STRING
 */

export default ({
  groupId
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'GroupCoordinator',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder().writeString(groupId)
  },
})
