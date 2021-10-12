/** @format */

import { Encoder } from '../../../encoder.ts';
import apiKeys from '../../apiKeys.ts';
const apiKey = apiKeys.ListOffsets;
/**
 * ListOffsets Request (Version: 1) => replica_id [topics]
 *   replica_id => INT32
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition timestamp
 *       partition => INT32
 *       timestamp => INT64
 */
export default ({ replicaId, topics }: any) => ({
  apiKey,
  apiVersion: 1,
  apiName: 'ListOffsets',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder()
      .writeInt32(replicaId)
      .writeArray(topics.map(encodeTopic));
  },
});

const encodeTopic = ({ topic, partitions }: any) => {
  return new Encoder()
    .writeString(topic)
    .writeArray(partitions.map(encodePartition));
};

const encodePartition = ({ partition, timestamp = -1 }: any) => {
  return new Encoder().writeInt32(partition).writeInt64(timestamp);
};
