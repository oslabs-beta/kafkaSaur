// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestV0'... Remove this comment to see the full error message
const requestV0 = require('../v0/request')

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
  mechanism
}: any) => ({ ...requestV0({ mechanism }), apiVersion: 1 })
