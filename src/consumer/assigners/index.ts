// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'roundRobin... Remove this comment to see the full error message
const roundRobin = require('./roundRobinAssigner')

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  roundRobin,
}
