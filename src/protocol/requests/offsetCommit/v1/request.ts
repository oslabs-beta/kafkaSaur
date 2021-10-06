import { Encoder } from '../../../encoder.ts'
import apiKeys from '../../apiKeys.ts'

const apiKey = apiKeys.OffsetCommit

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

export default ({
  groupId,
  groupGenerationId,
  memberId,
  topics
}: any) => ({
  apiKey,
  apiVersion: 1,
  apiName: 'OffsetCommit',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder()
      .writeString(groupId)
      .writeInt32(groupGenerationId)
      .writeString(memberId)
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
  timestamp = Date.now(),
  metadata = null
}: any) => {
  return new Encoder()
    .writeInt32(partition)
    .writeInt64(offset)
    .writeInt64(timestamp)
    .writeString(metadata)
}
