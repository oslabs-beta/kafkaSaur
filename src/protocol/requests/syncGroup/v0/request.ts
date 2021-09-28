// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { SyncGroup: apiKey } = require('../../apiKeys')

/**
 * SyncGroup Request (Version: 0) => group_id generation_id member_id [group_assignment]
 *   group_id => STRING
 *   generation_id => INT32
 *   member_id => STRING
 *   group_assignment => member_id member_assignment
 *     member_id => STRING
 *     member_assignment => BYTES
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
  groupId,
  generationId,
  memberId,
  groupAssignment
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'SyncGroup',
  encode: async () => {
    return new Encoder()
      .writeString(groupId)
      .writeInt32(generationId)
      .writeString(memberId)
      .writeArray(groupAssignment.map(encodeGroupAssignment))
  },
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeGrou... Remove this comment to see the full error message
const encodeGroupAssignment = ({
  memberId,
  memberAssignment
}: any) => {
  return new Encoder().writeString(memberId).writeBytes(memberAssignment)
}
