import requestV3 from '../v3/request.ts'

/**
 * OffsetFetch Request (Version: 4) => group_id [topics]
 *   group_id => STRING
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition
 *       partition => INT32
 */

export default ({
 groupId,
 topics
}: any) =>
  Object.assign(requestV3({ groupId, topics }), { apiVersion: 4 })
