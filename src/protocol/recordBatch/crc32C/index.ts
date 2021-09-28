// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'crc32C'.
const crc32C = require('./crc32C')
const unsigned = (value: any) => Uint32Array.from([value])[0]

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = (buffer: any) => unsigned(crc32C(buffer))
