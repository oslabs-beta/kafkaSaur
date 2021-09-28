// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parse'.
const { parse, decode } = require('../v2/response')

/**
 * Heartbeat Response (Version: 3) => throttle_time_ms error_code
 *   throttle_time_ms => INT32
 *   error_code => INT16
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  decode,
  parse,
}
