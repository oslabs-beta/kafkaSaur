// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { JoinGroup: apiKey } = require('../../apiKeys')

/**
 * JoinGroup Request (Version: 1) => group_id session_timeout rebalance_timeout member_id protocol_type [group_protocols]
 *   group_id => STRING
 *   session_timeout => INT32
 *   rebalance_timeout => INT32
 *   member_id => STRING
 *   protocol_type => STRING
 *   group_protocols => protocol_name protocol_metadata
 *     protocol_name => STRING
 *     protocol_metadata => BYTES
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
  groupId,
  sessionTimeout,
  rebalanceTimeout,
  memberId,
  protocolType,
  groupProtocols
}: any) => ({
  apiKey,
  apiVersion: 1,
  apiName: 'JoinGroup',
  encode: async () => {
    return new Encoder()
      .writeString(groupId)
      .writeInt32(sessionTimeout)
      .writeInt32(rebalanceTimeout)
      .writeString(memberId)
      .writeString(protocolType)
      .writeArray(groupProtocols.map(encodeGroupProtocols))
  },
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeGrou... Remove this comment to see the full error message
const encodeGroupProtocols = ({
  name,
  // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
  metadata = Buffer.alloc(0)
}: any) => {
  return new Encoder().writeString(name).writeBytes(metadata)
}
