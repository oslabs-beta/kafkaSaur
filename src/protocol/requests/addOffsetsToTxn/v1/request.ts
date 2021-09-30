// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestV0'... Remove this comment to see the full error message
import requestV0 from '../v0/request'

/**
 * AddOffsetsToTxn Request (Version: 1) => transactional_id producer_id producer_epoch group_id
 *   transactional_id => STRING
 *   producer_id => INT64
 *   producer_epoch => INT16
 *   group_id => STRING
 */

export default  ({
  transactionalId,
  producerId,
  producerEpoch,
  groupId
}: any) =>
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  Object.assign(
    requestV0({
      transactionalId,
      producerId,
      producerEpoch,
      groupId,
    }),
    { apiVersion: 1 }
  )
