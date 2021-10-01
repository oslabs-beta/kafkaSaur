// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const awsIam = require('../../protocol/sasl/awsIam')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSSAS... Remove this comment to see the full error message
const { KafkaJSSASLAuthenticationError } = require('../../errors')

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export class AWSIAMAuthenticator {
  connection: any;
  logger: any;
  saslAuthenticate: any;
  constructor(connection: any, logger: any, saslAuthenticate: any) {
    this.connection = connection
    this.logger = logger.namespace('SASLAWSIAMAuthenticator')
    this.saslAuthenticate = saslAuthenticate
  }

  async authenticate() {
    const { sasl } = this.connection
    if (!sasl.authorizationIdentity) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
      throw new KafkaJSSASLAuthenticationError('SASL AWS-IAM: Missing authorizationIdentity')
    }
    if (!sasl.accessKeyId) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
      throw new KafkaJSSASLAuthenticationError('SASL AWS-IAM: Missing accessKeyId')
    }
    if (!sasl.secretAccessKey) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
      throw new KafkaJSSASLAuthenticationError('SASL AWS-IAM: Missing secretAccessKey')
    }
    if (!sasl.sessionToken) {
      sasl.sessionToken = ''
    }

    const request = awsIam.request(sasl)
    const response = awsIam.response
    const { host, port } = this.connection
    const broker = `${host}:${port}`

    try {
      this.logger.debug('Authenticate with SASL AWS-IAM', { broker })
      await this.saslAuthenticate({ request, response })
      this.logger.debug('SASL AWS-IAM authentication successful', { broker })
    } catch (e) {
      const error = new KafkaJSSASLAuthenticationError(        
// @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.

        `SASL AWS-IAM authentication failed: ${e.message}`
      )
      this.logger.error(error.message, { broker })
      throw error
    }
  }
}
