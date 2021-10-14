/** @format */

import { Encoder } from '../../../encoder.ts';

import apiKeys from '../../apiKeys.ts';

/**
 * AddPartitionsToTxn Request (Version: 0) => transactional_id producer_id producer_epoch [topics]
 *   transactional_id => STRING
 *   producer_id => INT64
 *   producer_epoch => INT16
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => INT32
 */

const apiKey = apiKeys.AddPartitionsToTxn;

export default ({
  transactionalId,
  producerId,
  producerEpoch,
  topics,
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'AddPartitionsToTxn',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder()
      .writeString(transactionalId)
      .writeInt64(producerId)
      .writeInt16(producerEpoch)
      .writeArray(topics.map(encodeTopic));
  },
});

const encodeTopic = ({ topic, partitions }: any) => {
  return new Encoder()
    .writeString(topic)
    .writeArray(partitions.map(encodePartition));
};

const encodePartition = (partition: any) => {
  return new Encoder().writeInt32(partition);
};
