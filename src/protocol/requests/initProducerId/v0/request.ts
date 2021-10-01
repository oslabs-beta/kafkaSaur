// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { InitProducerId: apiKey } = require('../../apiKeys')

/**
 * InitProducerId Request (Version: 0) => transactional_id transaction_timeout_ms
 *   transactional_id => NULLABLE_STRING
 *   transaction_timeout_ms => INT32
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  transactionalId,
  transactionTimeout
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'InitProducerId',
  encode: async () => {
    return new Encoder().writeString(transactionalId).writeInt32(transactionTimeout)
  },
})
