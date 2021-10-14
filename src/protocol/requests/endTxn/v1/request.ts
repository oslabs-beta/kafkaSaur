import requestV0 from '../v0/request.ts'

/**
 * EndTxn Request (Version: 1) => transactional_id producer_id producer_epoch transaction_result
 *   transactional_id => STRING
 *   producer_id => INT64
 *   producer_epoch => INT16
 *   transaction_result => BOOLEAN
 */

export default ({
  transactionalId,
  producerId,
  producerEpoch,
  transactionResult
}: any) =>
  Object.assign(requestV0({ transactionalId, producerId, producerEpoch, transactionResult }), {
    apiVersion: 1,
  })
