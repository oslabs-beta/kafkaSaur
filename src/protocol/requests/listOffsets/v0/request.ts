/** @format */

import { Encoder } from '../../../encoder.ts';
import apiKeys from '../../apiKeys.ts';
const apiKey = apiKeys.ListOffsets;
/**
 * ListOffsets Request (Version: 0) => replica_id [topics]
 *   replica_id => INT32
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition timestamp max_num_offsets
 *       partition => INT32
 *       timestamp => INT64
 *       max_num_offsets => INT32
 */

/**
 * @param {number} replicaId
 * @param {object} topics use timestamp=-1 for latest offsets and timestamp=-2 for earliest.
 *                        Default timestamp=-1. Example:
 *                          {
 *                            topics: [
 *                              {
 *                                topic: 'topic-name',
 *                                partitions: [{ partition: 0, timestamp: -1 }]
 *                              }
 *                            ]
 *                          }
 */
export default ({ replicaId, topics }: any) => ({
  apiKey,
  apiVersion: 0,
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

const encodePartition = ({
  partition,
  timestamp = -1,
  maxNumOffsets = 1,
}: any) => {
  return new Encoder()
    .writeInt32(partition)
    .writeInt64(timestamp)
    .writeInt32(maxNumOffsets);
};
