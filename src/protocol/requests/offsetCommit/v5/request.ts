/** @format */

import { Encoder } from '../../../encoder.ts';
import apiKeys from '../../apiKeys.ts';
const apiKey = apiKeys.OffsetCommit;
/**
 * Version 5 removes retention_time, as this is controlled by a broker setting
 *
 * OffsetCommit Request (Version: 4) => group_id generation_id member_id [topics]
 *   group_id => STRING
 *   generation_id => INT32
 *   member_id => STRING
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition offset metadata
 *       partition => INT32
 *       offset => INT64
 *       metadata => NULLABLE_STRING
 */

export default ({ groupId, groupGenerationId, memberId, topics }: any) => ({
  apiKey,
  apiVersion: 5,
  apiName: 'OffsetCommit',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder()
      .writeString(groupId)
      .writeInt32(groupGenerationId)
      .writeString(memberId)
      .writeArray(topics.map(encodeTopic));
  },
});

const encodeTopic = ({ topic, partitions }: any) => {
  return new Encoder()
    .writeString(topic)
    .writeArray(partitions.map(encodePartition));
};

const encodePartition = ({ partition, offset, metadata = null }: any) => {
  return new Encoder()
    .writeInt32(partition)
    .writeInt64(offset)
    .writeString(metadata);
};
