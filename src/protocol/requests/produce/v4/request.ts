import requestV3 from '../v3/request.ts'

/**
 * Produce Request (Version: 4) => transactional_id acks timeout [topic_data]
 *   transactional_id => NULLABLE_STRING
 *   acks => INT16
 *   timeout => INT32
 *   topic_data => topic [data]
 *     topic => STRING
 *     data => partition record_set
 *       partition => INT32
 *       record_set => RECORDS
 */

export default ({
  acks,
  timeout,
  transactionalId,
  producerId,
  producerEpoch,
  compression,
  topicData
}: any) =>
  Object.assign(
    requestV3({
      acks,
      timeout,
      transactionalId,
      producerId,
      producerEpoch,
      compression,
      topicData,
    }),
    { apiVersion: 4 }
  )
