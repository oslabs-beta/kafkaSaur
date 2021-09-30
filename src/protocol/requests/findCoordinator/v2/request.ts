// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestV1'... Remove this comment to see the full error message
const requestV1 = require('../v1/request')

/**
 * FindCoordinator Request (Version: 2) => coordinator_key coordinator_type
 *   coordinator_key => STRING
 *   coordinator_type => INT8
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
 coordinatorKey,
 coordinatorType
}: any) =>
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  Object.assign(requestV1({ coordinatorKey, coordinatorType }), { apiVersion: 2 })
