/** @format */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
import Encoder from '../../../encoder.ts';
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
import { AddOffsetsToTxn } from '../../apiKeys.ts';
const { apiKey } = AddOffsetsToTxn;
/**
 * AddOffsetsToTxn Request (Version: 0) => transactional_id producer_id producer_epoch group_id
 *   transactional_id => STRING
 *   producer_id => INT64
 *   producer_epoch => INT16
 *   group_id => STRING
 */

export default ({
  transactionalId,
  producerId,
  producerEpoch,
  groupId,
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'AddOffsetsToTxn',
  encode: async () => {
    return new Encoder()
      .writeString(transactionalId)
      .writeInt64(producerId)
      .writeInt16(producerEpoch)
      .writeString(groupId);
  },
});
