// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SCRAM'.
const { SCRAM, DIGESTS } = require('./scram')

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class SCRAM256Authenticator extends SCRAM {
  constructor(connection: any, logger: any, saslAuthenticate: any) {
    super(connection, logger.namespace('SCRAM256Authenticator'), saslAuthenticate, DIGESTS.SHA256)
  }
}
