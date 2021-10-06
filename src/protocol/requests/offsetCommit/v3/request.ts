/** @format */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestV2'... Remove this comment to see the full error message
const requestV2 = require('../v2/request');

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
