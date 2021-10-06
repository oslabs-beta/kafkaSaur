import {Encoder} from '../../../encoder.ts'
import apiKeys from '../../apiKeys.ts'
const apiKey = apiKeys.SyncGroup;
/**
 * Version 3 adds group_instance_id to indicate member identity across restarts.
 * @see https://cwiki.apache.org/confluence/display/KAFKA/KIP-345%3A+Introduce+static+membership+protocol+to+reduce+consumer+rebalances
 *
 * SyncGroup Request (Version: 3) => group_id generation_id member_id group_instance_id [group_assignment]
 *   group_id => STRING
 *   generation_id => INT32
 *   member_id => STRING
 *   group_instance_id => NULLABLE_STRING
 *   group_assignment => member_id member_assignment
 *     member_id => STRING
 *     member_assignment => BYTES
 */

export default ({
  groupId,
  generationId,
  memberId,
  groupInstanceId = null,
  groupAssignment
}: any) => ({
  apiKey,
  apiVersion: 3,
  apiName: 'SyncGroup',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder()
      .writeString(groupId)
      .writeInt32(generationId)
      .writeString(memberId)
      .writeString(groupInstanceId)
      .writeArray(groupAssignment.map(encodeGroupAssignment))
  },
})

const encodeGroupAssignment = ({
  memberId,
  memberAssignment
}: any) => {
  return new Encoder().writeString(memberId).writeBytes(memberAssignment)
}
