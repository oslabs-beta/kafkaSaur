// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requests'.
const { requests, lookup } = require('../../protocol/requests')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKeys'.
const apiKeys = require('../../protocol/requests/apiKeys')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const PlainAuthenticator = require('./plain')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const SCRAM256Authenticator = require('./scram256')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const SCRAM512Authenticator = require('./scram512')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const AWSIAMAuthenticator = require('./awsIam')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const OAuthBearerAuthenticator = require('./oauthBearer')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSSAS... Remove this comment to see the full error message
const { KafkaJSSASLAuthenticationError } = require('../../errors')

const AUTHENTICATORS = {
  PLAIN: PlainAuthenticator,
  'SCRAM-SHA-256': SCRAM256Authenticator,
  'SCRAM-SHA-512': SCRAM512Authenticator,
  AWS: AWSIAMAuthenticator,
  OAUTHBEARER: OAuthBearerAuthenticator,
}

const SUPPORTED_MECHANISMS = Object.keys(AUTHENTICATORS)
const UNLIMITED_SESSION_LIFETIME = '0'

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export class SASLAuthenticator {
  connection: any;
  logger: any;
  protocolAuthentication: any;
  saslHandshake: any;
  sessionLifetime: any;
  constructor(connection: any, logger: any, versions: any, supportAuthenticationProtocol: any) {
    this.connection = connection
    this.logger = logger
    this.sessionLifetime = UNLIMITED_SESSION_LIFETIME

    const lookupRequest = lookup(versions)
    this.saslHandshake = lookupRequest(apiKeys.SaslHandshake, requests.SaslHandshake)
    this.protocolAuthentication = supportAuthenticationProtocol
      ? lookupRequest(apiKeys.SaslAuthenticate, requests.SaslAuthenticate)
      : null
  }

  async authenticate() {
    const mechanism = this.connection.sasl.mechanism.toUpperCase()
    // @ts-expect-error ts-migrate(2550) FIXME: Property 'includes' does not exist on type 'string... Remove this comment to see the full error message
    if (!SUPPORTED_MECHANISMS.includes(mechanism)) {
      throw new KafkaJSSASLAuthenticationError(        
// @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.

        `SASL ${mechanism} mechanism is not supported by the client`
      )
    }

    const handshake = await this.connection.send(this.saslHandshake({ mechanism }))
    if (!handshake.enabledMechanisms.includes(mechanism)) {
      throw new KafkaJSSASLAuthenticationError(        
// @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.

        `SASL ${mechanism} mechanism is not supported by the server`
      )
    }

    const saslAuthenticate = async ({
      request,
      response,
      authExpectResponse
    }: any) => {
      if (this.protocolAuthentication) {
        const { buffer: requestAuthBytes } = await request.encode()
        const authResponse = await this.connection.send(
          this.protocolAuthentication({ authBytes: requestAuthBytes })
        )

        // `0` is a string because `sessionLifetimeMs` is an int64 encoded as string.
        // This is not present in SaslAuthenticateV0, so we default to `"0"`
        this.sessionLifetime = authResponse.sessionLifetimeMs || UNLIMITED_SESSION_LIFETIME

        if (!authExpectResponse) {
          return
        }

        const { authBytes: responseAuthBytes } = authResponse
        const payloadDecoded = await response.decode(responseAuthBytes)
        return response.parse(payloadDecoded)
      }

      return this.connection.authenticate({ request, response, authExpectResponse })
    }

    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const Authenticator = AUTHENTICATORS[mechanism]
    await new Authenticator(this.connection, this.logger, saslAuthenticate).authenticate()
  }
}
