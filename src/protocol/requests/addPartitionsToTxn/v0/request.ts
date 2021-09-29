
import Encoder from '../../../encoder'

import  {AddPartitionsToTxn as apiKey } from '../../apiKeys'
//steph how do you inmort from an object

/**
 * AddPartitionsToTxn Request (Version: 0) => transactional_id producer_id producer_epoch [topics]
 *   transactional_id => STRING
 *   producer_id => INT64
 *   producer_epoch => INT16
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => INT32
 */


export default ({
  transactionalId,
  producerId,
  producerEpoch,
  topics
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'AddPartitionsToTxn',
  encode: async () => {
    return new Encoder()
      .writeString(transactionalId)
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
const encodePartition = (partition: any) => {
  return new Encoder().writeInt32(partition)
}
