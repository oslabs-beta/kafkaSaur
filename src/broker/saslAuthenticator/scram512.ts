import { SCRAM,DIGESTS } from './scram.ts';

export class SCRAM512Authenticator extends SCRAM {
  constructor(connection: any, logger: any, saslAuthenticate: any) {
    super(connection, logger.namespace('SCRAM512Authenticator'), saslAuthenticate, DIGESTS.SHA512)
  }
}
