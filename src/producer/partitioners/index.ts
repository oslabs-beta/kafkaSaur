// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DefaultPar... Remove this comment to see the full error message
const DefaultPartitioner = require('./default')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const JavaCompatiblePartitioner = require('./defaultJava')

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  DefaultPartitioner,
  JavaCompatiblePartitioner,
}
