// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { LeaveGroup: apiKey } = require('../../apiKeys')

/**
 * LeaveGroup Request (Version: 0) => group_id member_id
 *   group_id => STRING
 *   member_id => STRING
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  groupId,
  memberId
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'LeaveGroup',
  encode: async () => {
    return new Encoder().writeString(groupId).writeString(memberId)
  },
})
