import {Encoder} from '../../../encoder.ts'
import apiKeys from '../../apiKeys.ts'

const apiKey = apiKeys.Fetch

/**
 * Fetch Request (Version: 0) => replica_id max_wait_time min_bytes [topics]
 *   replica_id => INT32
 *   max_wait_time => INT32
 *   min_bytes => INT32
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition fetch_offset max_bytes
 *       partition => INT32
 *       fetch_offset => INT64
 *       max_bytes => INT32
 */

/**
 * @param {number} replicaId Broker id of the follower
 * @param {number} maxWaitTime Maximum time in ms to wait for the response
 * @param {number} minBytes Minimum bytes to accumulate in the response.
 * @param {Array} topics Topics to fetch
 *                        [
 *                          {
 *                            topic: 'topic-name',
 *                            partitions: [
 *                              {
 *                                partition: 0,
 *                                fetchOffset: '4124',
 *                                maxBytes: 2048
 *                              }
 *                            ]
 *                          }
 *                        ]
 */
export default ({
  replicaId,
  maxWaitTime,
  minBytes,
  topics
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'Fetch',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder()
      .writeInt32(replicaId)
      .writeInt32(maxWaitTime)
      .writeInt32(minBytes)
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
  fetchOffset,
  maxBytes
}: any) => {
  return new Encoder()
    .writeInt32(partition)
    .writeInt64(fetchOffset)
    .writeInt32(maxBytes)
}
