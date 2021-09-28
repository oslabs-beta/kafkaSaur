// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { LeaveGroup: apiKey } = require('../../apiKeys')

/**
 * Version 3 changes leavegroup to operate on a batch of members
 * and adds group_instance_id to identify members across restarts.
 * @see https://cwiki.apache.org/confluence/display/KAFKA/KIP-345%3A+Introduce+static+membership+protocol+to+reduce+consumer+rebalances
 *
 * LeaveGroup Request (Version: 3) => group_id [members]
 *   group_id => STRING
 *   members => member_id group_instance_id
 *     member_id => STRING
 *     group_instance_id => NULLABLE_STRING
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
  groupId,
  members
}: any) => ({
  apiKey,
  apiVersion: 3,
  apiName: 'LeaveGroup',
  encode: async () => {
    return new Encoder()
      .writeString(groupId)
      .writeArray(members.map((member: any) => encodeMember(member)));
  },
})

const encodeMember = ({
  memberId,
  groupInstanceId = null
}: any) => {
  return new Encoder().writeString(memberId).writeString(groupInstanceId)
}
