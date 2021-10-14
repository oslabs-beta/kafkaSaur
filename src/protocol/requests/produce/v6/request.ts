import requestV5 from '../v5/request.ts'

/**
 * The version number is bumped to indicate that on quota violation brokers send out responses before throttling.
 * @see https://github.com/apache/kafka/blob/9c8f75c4b624084c954b4da69f092211a9ac4689/clients/src/main/java/org/apache/kafka/common/requests/ProduceRequest.java#L113-L117
 *
 * Produce Request (Version: 6) => transactional_id acks timeout [topic_data]
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
    requestV5({
      acks,
      timeout,
      transactionalId,
      producerId,
      producerEpoch,
      compression,
      topicData,
    }),
    { apiVersion: 6 }
  )
