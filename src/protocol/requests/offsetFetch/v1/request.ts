import {Encoder} from '../../../encoder.ts'
import apiKeys from '../../apiKeys.ts'

const apiKey = apiKeys.OffsetFetch;

/**
 * OffsetFetch Request (Version: 1) => group_id [topics]
 *   group_id => STRING
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition
 *       partition => INT32
 */

export default ({
  groupId,
  topics
}: any) => ({
  apiKey,
  apiVersion: 1,
  apiName: 'OffsetFetch',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder().writeString(groupId).writeArray(topics.map(encodeTopic))
  },
})

const encodeTopic = ({
  topic,
  partitions
}: any) => {
  return new Encoder().writeString(topic).writeArray(partitions.map(encodePartition))
}

const encodePartition = ({
  partition
}: any) => {
  return new Encoder().writeInt32(partition)
}
