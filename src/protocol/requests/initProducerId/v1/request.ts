// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestV0'... Remove this comment to see the full error message
const requestV0 = require('../v0/request')

/**
 * InitProducerId Request (Version: 1) => transactional_id transaction_timeout_ms
 *   transactional_id => NULLABLE_STRING
 *   transaction_timeout_ms => INT32
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
 transactionalId,
 transactionTimeout
}: any) =>
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  Object.assign(requestV0({ transactionalId, transactionTimeout }), { apiVersion: 1 })
