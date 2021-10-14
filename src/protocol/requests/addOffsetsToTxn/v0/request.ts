/** @format */

import { Encoder } from '../../../encoder.ts';
import apiKeys from '../../apiKeys.ts';
const apiKey = apiKeys.AddOffsetsToTxn;

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
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder()
      .writeString(transactionalId)
      .writeInt64(producerId)
      .writeInt16(producerEpoch)
      .writeString(groupId);
  },
});
