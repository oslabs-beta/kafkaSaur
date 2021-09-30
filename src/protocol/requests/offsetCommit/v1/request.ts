// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { OffsetCommit: apiKey } = require('../../apiKeys')

/**
 * OffsetCommit Request (Version: 1) => group_id group_generation_id member_id [topics]
 *   group_id => STRING
 *   group_generation_id => INT32
 *   member_id => STRING
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition offset timestamp metadata
 *       partition => INT32
 *       offset => INT64
 *       timestamp => INT64
 *       metadata => NULLABLE_STRING
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  groupId,
  groupGenerationId,
  memberId,
  topics
}: any) => ({
  apiKey,
  apiVersion: 1,
  apiName: 'OffsetCommit',
  encode: async () => {
    return new Encoder()
      .writeString(groupId)
      .writeInt32(groupGenerationId)
      .writeString(memberId)
      .writeArray(topics.map(encodeTopic))
  },
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeTopi... Remove this comment to see the full error message
const encodeTopic = ({
  topic,
  partitions
}: any) => {
  return new Encoder().writeString(topic).writeArray(partitions.map(encodePartition))
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodePart... Remove this comment to see the full error message
const encodePartition = ({
  partition,
  offset,
  timestamp = Date.now(),
  metadata = null
}: any) => {
  return new Encoder()
    .writeInt32(partition)
    .writeInt64(offset)
    .writeInt64(timestamp)
    .writeString(metadata)
}
