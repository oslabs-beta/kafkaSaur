// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Long'.
const Long = require('../../../../utils/long')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { Produce: apiKey } = require('../../apiKeys')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Types'.
const { Types } = require('../../../message/compression')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const Record = require('../../../recordBatch/record/v0')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RecordBatc... Remove this comment to see the full error message
const { RecordBatch } = require('../../../recordBatch/v0')

/**
 * Produce Request (Version: 3) => transactional_id acks timeout [topic_data]
 *   transactional_id => NULLABLE_STRING
 *   acks => INT16
 *   timeout => INT32
 *   topic_data => topic [data]
 *     topic => STRING
 *     data => partition record_set
 *       partition => INT32
 *       record_set => RECORDS
 */

/**
 * @param [transactionalId=null] {String} The transactional id or null if the producer is not transactional
 * @param acks {Integer} See producer request v0
 * @param timeout {Integer} See producer request v0
 * @param [compression=CompressionTypes.None] {CompressionTypes}
 * @param topicData {Array}
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
  acks,
  timeout,
  transactionalId = null,
  producerId = Long.fromInt(-1),
  producerEpoch = 0,
  compression = Types.None,
  topicData
}: any) => ({
  apiKey,
  apiVersion: 3,
  apiName: 'Produce',
  expectResponse: () => acks !== 0,
  encode: async () => {
    const encodeTopic = topicEncoder(compression)
    const encodedTopicData = []

    for (const data of topicData) {
      encodedTopicData.push(
        await encodeTopic({ ...data, transactionalId, producerId, producerEpoch })
      )
    }

    return new Encoder()
      .writeString(transactionalId)
      .writeInt16(acks)
      .writeInt32(timeout)
      .writeArray(encodedTopicData)
  },
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'topicEncod... Remove this comment to see the full error message
const topicEncoder = (compression: any) => async ({
  topic,
  partitions,
  transactionalId,
  producerId,
  producerEpoch
}: any) => {
  const encodePartitions = partitionsEncoder(compression)
  const encodedPartitions = []

  for (const data of partitions) {
    encodedPartitions.push(
      await encodePartitions({ ...data, transactionalId, producerId, producerEpoch })
    )
  }

  return new Encoder().writeString(topic).writeArray(encodedPartitions)
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'partitions... Remove this comment to see the full error message
const partitionsEncoder = (compression: any) => async ({
  partition,
  messages,
  transactionalId,
  firstSequence,
  producerId,
  producerEpoch
}: any) => {
  const dateNow = Date.now()
  const messageTimestamps = messages
    .map((m: any) => m.timestamp)
    .filter((timestamp: any) => timestamp != null)
    .sort()

  const timestamps = messageTimestamps.length === 0 ? [dateNow] : messageTimestamps
  const firstTimestamp = timestamps[0]
  const maxTimestamp = timestamps[timestamps.length - 1]

  const records = messages.map((message: any, i: any) =>
    Record({
      ...message,
      offsetDelta: i,
      timestampDelta: (message.timestamp || dateNow) - firstTimestamp,
    })
  )

  const recordBatch = await RecordBatch({
    compression,
    records,
    firstTimestamp,
    maxTimestamp,
    producerId,
    producerEpoch,
    firstSequence,
    transactional: !!transactionalId,
    lastOffsetDelta: records.length - 1,
  })

  return new Encoder()
    .writeInt32(partition)
    .writeInt32(recordBatch.size())
    .writeEncoder(recordBatch)
}
