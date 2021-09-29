// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { OffsetCommit: apiKey } = require('../../apiKeys')

/**
 * OffsetCommit Request (Version: 0) => group_id [topics]
 *   group_id => STRING
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition offset metadata
 *       partition => INT32
 *       offset => INT64
 *       metadata => NULLABLE_STRING
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  groupId,
  topics
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'OffsetCommit',
  encode: async () => {
    return new Encoder().writeString(groupId).writeArray(topics.map(encodeTopic))
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
  metadata = null
}: any) => {
  return new Encoder()
    .writeInt32(partition)
    .writeInt64(offset)
    .writeString(metadata)
}
