/** @format */

import { Encoder } from '../../../encoder.ts';
import apiKeys from '../../apiKeys.ts';
const apiKey = apiKeys.InitProducerId;
/**
 * InitProducerId Request (Version: 0) => transactional_id transaction_timeout_ms
 *   transactional_id => NULLABLE_STRING
 *   transaction_timeout_ms => INT32
 */

export default ({ transactionalId, transactionTimeout }: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'InitProducerId',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder()
      .writeString(transactionalId)
      .writeInt32(transactionTimeout);
  },
});
