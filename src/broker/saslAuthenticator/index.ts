/** @format */

import { requests, lookup } from '../../protocol/requests/index.ts';
import apiKeys from '../../protocol/requests/apiKeys.ts';
import { PlainAuthenticator } from './plain.ts';
import { SCRAM256Authenticator } from './scram256.ts';
import { SCRAM512Authenticator } from './scram512.ts';
import { AWSIAMAuthenticator } from './awsIam.ts';
import { OAuthBearerAuthenticator } from './oauthBearer.ts';
import { KafkaJSSASLAuthenticationError } from '../../errors.ts';

const AUTHENTICATORS = {
  PLAIN: PlainAuthenticator,
  'SCRAM-SHA-256': SCRAM256Authenticator,
  'SCRAM-SHA-512': SCRAM512Authenticator,
  AWS: AWSIAMAuthenticator,
  OAUTHBEARER: OAuthBearerAuthenticator,
};

const SUPPORTED_MECHANISMS = Object.keys(AUTHENTICATORS);
const UNLIMITED_SESSION_LIFETIME = '0';

export class SASLAuthenticator {
  connection: any;
  logger: any;
  protocolAuthentication: any;
  saslHandshake: any;
  sessionLifetime: any;
  constructor(
    connection: any,
    logger: any,
    versions: any,
    supportAuthenticationProtocol: any
  ) {
    this.connection = connection;
    this.logger = logger;
    this.sessionLifetime = UNLIMITED_SESSION_LIFETIME;

    const lookupRequest = lookup(versions);
    this.saslHandshake = lookupRequest(
      apiKeys.SaslHandshake,
      requests.SaslHandshake
    );
    this.protocolAuthentication = supportAuthenticationProtocol
      ? lookupRequest(apiKeys.SaslAuthenticate, requests.SaslAuthenticate)
      : null;
  }

  async authenticate() {
    const mechanism: any = this.connection.sasl.mechanism.toUpperCase();
    if (!SUPPORTED_MECHANISMS.includes(mechanism)) {
      throw new KafkaJSSASLAuthenticationError(
        `SASL ${mechanism} mechanism is not supported by the client`
      );
    }

    const handshake = await this.connection.send(
      this.saslHandshake({ mechanism })
    );
    if (!handshake.enabledMechanisms.includes(mechanism)) {
      throw new KafkaJSSASLAuthenticationError(
        `SASL ${mechanism} mechanism is not supported by the server`
      );
    }

    const saslAuthenticate = async ({
      request,
      response,
      authExpectResponse,
    }: any) => {
      if (this.protocolAuthentication) {
        const { buffer: requestAuthBytes } = await request.encode();
        const authResponse = await this.connection.send(
          this.protocolAuthentication({ authBytes: requestAuthBytes })
        );

        // `0` is a string because `sessionLifetimeMs` is an int64 encoded as string.
        // This is not present in SaslAuthenticateV0, so we default to `"0"`
        this.sessionLifetime =
          authResponse.sessionLifetimeMs || UNLIMITED_SESSION_LIFETIME;

        if (!authExpectResponse) {
          return;
        }

        const { authBytes: responseAuthBytes } = authResponse;
        const payloadDecoded = await response.decode(responseAuthBytes);
        return response.parse(payloadDecoded);
      }

      return this.connection.authenticate({
        request,
        response,
        authExpectResponse,
      });
    };
    // @ts-ignore
    const Authenticator = AUTHENTICATORS[mechanism];
    await new Authenticator(
      this.connection,
      this.logger,
      saslAuthenticate
    ).authenticate();
  }
}
