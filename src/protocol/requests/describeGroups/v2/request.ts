// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestV1'... Remove this comment to see the full error message
const requestV1 = require('../v1/request')

/**
 * DescribeGroups Request (Version: 2) => [group_ids]
 *   group_ids => STRING
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
 groupIds
// @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
}: any) => Object.assign(requestV1({ groupIds }), { apiVersion: 2 })
