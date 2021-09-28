/**
 * The sasl object must include a property named oauthBearerProvider, an
 * async function that is used to return the OAuth bearer token.
 *
 * The OAuth bearer token must be an object with properties value and
 * (optionally) extensions, that will be sent during the SASL/OAUTHBEARER
 * request.
 *
 * The implementation of the oauthBearerProvider must take care that tokens are
 * reused and refreshed when appropriate.
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const oauthBearer = require('../../protocol/sasl/oauthBearer')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSSAS... Remove this comment to see the full error message
const { KafkaJSSASLAuthenticationError } = require('../../errors')

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class OAuthBearerAuthenticator {
  connection: any;
  logger: any;
  saslAuthenticate: any;
  constructor(connection: any, logger: any, saslAuthenticate: any) {
    this.connection = connection
    this.logger = logger.namespace('SASLOAuthBearerAuthenticator')
    this.saslAuthenticate = saslAuthenticate
  }

  async authenticate() {
    const { sasl } = this.connection
    if (sasl.oauthBearerProvider == null) {
      throw new KafkaJSSASLAuthenticationError(
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
        'SASL OAUTHBEARER: Missing OAuth bearer token provider'
      )
    }

    const { oauthBearerProvider } = sasl

    const oauthBearerToken = await oauthBearerProvider()

    if (oauthBearerToken.value == null) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
      throw new KafkaJSSASLAuthenticationError('SASL OAUTHBEARER: Invalid OAuth bearer token')
    }

    const request = await oauthBearer.request(sasl, oauthBearerToken)
    const response = oauthBearer.response
    const { host, port } = this.connection
    const broker = `${host}:${port}`

    try {
      this.logger.debug('Authenticate with SASL OAUTHBEARER', { broker })
      await this.saslAuthenticate({ request, response })
      this.logger.debug('SASL OAUTHBEARER authentication successful', { broker })
    } catch (e) {
      const error = new KafkaJSSASLAuthenticationError(        
// @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.

        `SASL OAUTHBEARER authentication failed: ${e.message}`
      )
      this.logger.error(error.message, { broker })
      throw error
    }
  }
}
