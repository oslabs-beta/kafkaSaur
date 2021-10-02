// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'murmur2'.

import murmur2 from './murmur2.ts'
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createDefa... Remove this comment to see the full error message
const createDefaultPartitioner = require('../default/partitioner')

export default createDefaultPartitioner(murmur2)
