/** @format */

import requestV3 from '../v3/request.ts';

/**
 * OffsetCommit Request (Version: 4) => group_id generation_id member_id retention_time [topics]
 *   group_id => STRING
 *   generation_id => INT32
 *   member_id => STRING
 *   retention_time => INT64
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition offset metadata
 *       partition => INT32
 *       offset => INT64
 *       metadata => NULLABLE_STRING
 */

export default ({
  groupId,
  groupGenerationId,
  memberId,
  retentionTime,
  topics,
}: any) =>
  Object.assign(
    requestV3({ groupId, groupGenerationId, memberId, retentionTime, topics }),
    {
      apiVersion: 4,
    }
  );
