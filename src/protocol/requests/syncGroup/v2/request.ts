 import requestV1 from '../v1/request.ts'

/**
 * SyncGroup Request (Version: 2) => group_id generation_id member_id [group_assignment]
 *   group_id => STRING
 *   generation_id => INT32
 *   member_id => STRING
 *   group_assignment => member_id member_assignment
 *     member_id => STRING
 *     member_assignment => BYTES
 */

export default ({
 groupId,
 generationId,
 memberId,
 groupAssignment
}: any) =>
  Object.assign(requestV1({ groupId, generationId, memberId, groupAssignment }), { apiVersion: 2 })
