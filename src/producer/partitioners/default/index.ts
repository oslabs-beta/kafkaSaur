// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'murmur2'.
const murmur2 = require('./murmur2')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createDefa... Remove this comment to see the full error message
const createDefaultPartitioner = require('./partitioner')

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = createDefaultPartitioner(murmur2)
