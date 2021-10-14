/** @format */

import { Encoder } from '../../encoder.ts';

const US_ASCII_NULL_CHAR = '\u0000';

export default ({
  authorizationIdentity,
  accessKeyId,
  secretAccessKey,
  sessionToken = '',
}: any) => ({
  encode: async () => {
    return new Encoder().writeBytes(
      [authorizationIdentity, accessKeyId, secretAccessKey, sessionToken].join(
        US_ASCII_NULL_CHAR
      )
    );
  },
});
