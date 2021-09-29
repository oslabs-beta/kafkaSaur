// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestV3'... Remove this comment to see the full error message
const requestV3 = require('../v3/request')

/**
 * OffsetFetch Request (Version: 4) => group_id [topics]
 *   group_id => STRING
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition
 *       partition => INT32
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
 groupId,
 topics
}: any) =>
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  Object.assign(requestV3({ groupId, topics }), { apiVersion: 4 })
