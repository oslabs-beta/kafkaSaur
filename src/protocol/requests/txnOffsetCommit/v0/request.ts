// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
import Encoder from '../../../encoder'
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
import { TxnOffsetCommit as apiKey } from '../../apiKeys'

/**
 * TxnOffsetCommit Request (Version: 0) => transactional_id group_id producer_id producer_epoch [topics]
 *   transactional_id => STRING
 *   group_id => STRING
 *   producer_id => INT64
 *   producer_epoch => INT16
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition offset metadata
 *       partition => INT32
 *       offset => INT64
 *       metadata => NULLABLE_STRING
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  transactionalId,
  groupId,
  producerId,
  producerEpoch,
  topics
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'TxnOffsetCommit',
  encode: async () => {
    return new Encoder()
      .writeString(transactionalId)
      .writeString(groupId)
      .writeInt64(producerId)
      .writeInt16(producerEpoch)
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
  metadata
}: any) => {
  return new Encoder()
    .writeInt32(partition)
    .writeInt64(offset)
    .writeString(metadata)
}
