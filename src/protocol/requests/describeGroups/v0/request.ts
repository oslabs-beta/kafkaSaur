import {Encoder} from '../../../encoder.ts'
import apiKeys from '../../apiKeys.ts'
const apiKey = apiKeys.DescribeGroups
/**
 * DescribeGroups Request (Version: 0) => [group_ids]
 *   group_ids => STRING
 */

/**
 * @param {Array} groupIds List of groupIds to request metadata for (an empty groupId array will return empty group metadata)
 */
export default ({
 groupIds
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'DescribeGroups',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder().writeArray(groupIds)
  },
})
