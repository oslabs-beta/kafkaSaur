import {Encoder} from '../../../encoder.ts' 
import apiKeys from '../../apiKeys.ts'
const apiKey = apiKeys.DeleteGroups
/**
 * DeleteGroups Request (Version: 0) => [groups_names]
 *   groups_names => STRING
 */

/**
 */
export default (groupIds: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'DeleteGroups',
//deno-lint-ignore require-await
  encode: async () => {
    return new Encoder().writeArray(groupIds.map(encodeGroups))
  }
})

const encodeGroups = (group: any) => {
  return new Encoder().writeString(group)
}
