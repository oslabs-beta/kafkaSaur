// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { ListOffsets: apiKey } = require('../../apiKeys')

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
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  replicaId,
  topics
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'ListOffsets',
  encode: async () => {
    return new Encoder().writeInt32(replicaId).writeArray(topics.map(encodeTopic))
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
  timestamp = -1,
  maxNumOffsets = 1
}: any) => {
  return new Encoder()
    .writeInt32(partition)
    .writeInt64(timestamp)
    .writeInt32(maxNumOffsets)
}
