// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decodeV0'.
const { decode: decodeV0, parse: parseV0 } = require('../v0/response')

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export {
  decode: decodeV0,
  parse: parseV0,
}
