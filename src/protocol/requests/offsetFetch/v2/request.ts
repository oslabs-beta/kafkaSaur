import requestV1 from '../v1/request.ts'

/**
 * OffsetFetch Request (Version: 2) => group_id [topics]
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
  Object.assign(requestV1({ groupId, topics }), { apiVersion: 2 })
