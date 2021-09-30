// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestV1'... Remove this comment to see the full error message
const requestV1 = require('../v1/request')

/**
 * LeaveGroup Request (Version: 2) => group_id member_id
 *   group_id => STRING
 *   member_id => STRING
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
 groupId,
 memberId
}: any) =>
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  Object.assign(requestV1({ groupId, memberId }), { apiVersion: 2 })
