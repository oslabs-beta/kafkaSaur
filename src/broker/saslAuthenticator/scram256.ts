import { SCRAM,DIGESTS } from './scram.ts';

export class SCRAM256Authenticator extends SCRAM {
  constructor(connection: any, logger: any, saslAuthenticate: any) {
    super(connection, logger.namespace('SCRAM256Authenticator'), saslAuthenticate, DIGESTS.SHA256)
  }
}
