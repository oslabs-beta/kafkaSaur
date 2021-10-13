/** @format */

import requestV0 from '../v0/request.ts';

/**
 * AddOffsetsToTxn Request (Version: 1) => transactional_id producer_id producer_epoch group_id
 *   transactional_id => STRING
 *   producer_id => INT64
 *   producer_epoch => INT16
 *   group_id => STRING
 */

export default ({ transactionalId, producerId, producerEpoch, groupId }: any) =>
  Object.assign(
    requestV0({
      transactionalId,
      producerId,
      producerEpoch,
      groupId,
    }),
    { apiVersion: 1 }
  );
