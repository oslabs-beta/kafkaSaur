// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestV2'... Remove this comment to see the full error message
const requestV2 = require('../v2/request')

/**
 * ListOffsets Request (Version: 3) => replica_id isolation_level [topics]
 *   replica_id => INT32
 *   isolation_level => INT8
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition timestamp
 *       partition => INT32
 *       timestamp => INT64
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
 replicaId,
 isolationLevel,
 topics
}: any) =>
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  Object.assign(requestV2({ replicaId, isolationLevel, topics }), { apiVersion: 3 })
