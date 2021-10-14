/** @format */

import requestV0 from '../v0/request.ts';

/**
 * AddPartitionsToTxn Request (Version: 1) => transactional_id producer_id producer_epoch [topics]
 *   transactional_id => STRING
 *   producer_id => INT64
 *   producer_epoch => INT16
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => INT32
 */

export default ({ transactionalId, producerId, producerEpoch, topics }: any) =>
  Object.assign(
    requestV0({
      transactionalId,
      producerId,
      producerEpoch,
      topics,
    }),
    { apiVersion: 1 }
  );
