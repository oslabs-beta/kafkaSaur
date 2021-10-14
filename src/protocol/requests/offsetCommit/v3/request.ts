/** @format */

import requestV2 from '../v2/request.ts';

/**
 * OffsetCommit Request (Version: 3) => group_id generation_id member_id retention_time [topics]
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
    requestV2({ groupId, groupGenerationId, memberId, retentionTime, topics }),
    {
      apiVersion: 3,
    }
  );
