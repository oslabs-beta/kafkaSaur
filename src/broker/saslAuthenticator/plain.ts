// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const plain = require('../../protocol/sasl/plain')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSSAS... Remove this comment to see the full error message
const { KafkaJSSASLAuthenticationError } = require('../../errors')

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export class PlainAuthenticator {
  connection: any;
  logger: any;
  saslAuthenticate: any;
  constructor(connection: any, logger: any, saslAuthenticate: any) {
    this.connection = connection
    this.logger = logger.namespace('SASLPlainAuthenticator')
    this.saslAuthenticate = saslAuthenticate
  }

  async authenticate() {
    const { sasl } = this.connection
    if (sasl.username == null || sasl.password == null) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
      throw new KafkaJSSASLAuthenticationError('SASL Plain: Invalid username or password')
    }

    const request = plain.request(sasl)
    const response = plain.response
    const { host, port } = this.connection
    const broker = `${host}:${port}`

    try {
      this.logger.debug('Authenticate with SASL PLAIN', { broker })
      await this.saslAuthenticate({ request, response })
      this.logger.debug('SASL PLAIN authentication successful', { broker })
    } catch (e) {
      const error = new KafkaJSSASLAuthenticationError(        
// @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.

        `SASL PLAIN authentication failed: ${e.message}`
      )
      this.logger.error(error.message, { broker })
      throw error
    }
  }
}
