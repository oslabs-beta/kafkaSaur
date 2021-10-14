import {Encoder} from '../../../encoder.ts'
import apiKeys from '../../apiKeys.ts'

const apiKey = apiKeys.TxnOffsetCommit;
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

export default ({
  transactionalId,
  groupId,
  producerId,
  producerEpoch,
  topics
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'TxnOffsetCommit',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder()
      .writeString(transactionalId)
      .writeString(groupId)
      .writeInt64(producerId)
      .writeInt16(producerEpoch)
      .writeArray(topics.map(encodeTopic))
  },
})

const encodeTopic = ({
  topic,
  partitions
}: any) => {
  return new Encoder().writeString(topic).writeArray(partitions.map(encodePartition))
}

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
