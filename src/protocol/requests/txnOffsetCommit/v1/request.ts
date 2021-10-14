import requestV0 from '../v0/request.ts'

/**
 * TxnOffsetCommit Request (Version: 1) => transactional_id group_id producer_id producer_epoch [topics]
 *   transactional_id => STRING
 *   group_id => STRING
 *   producer_id => INT64
 *   producer_epoch => INT16
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition offset metadata
 *       partition => INT32
 *       offset => INT64
 *       metadata => NULLABLE_STRING
 */

export default ({
  transactionalId,
  groupId,
  producerId,
  producerEpoch,
  topics
}: any) =>
  Object.assign(requestV0({ transactionalId, groupId, producerId, producerEpoch, topics }), {
    apiVersion: 1,
  })
