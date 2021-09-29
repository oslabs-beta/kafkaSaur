// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestV3'... Remove this comment to see the full error message
const requestV3 = require('../v3/request')

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

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  groupId,
  groupGenerationId,
  memberId,
  retentionTime,
  topics
}: any) =>
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  Object.assign(requestV3({ groupId, groupGenerationId, memberId, retentionTime, topics }), {
    apiVersion: 4,
  })
