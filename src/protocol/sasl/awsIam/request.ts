// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
import Encoder from '../../encoder'

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'US_ASCII_N... Remove this comment to see the full error message
const US_ASCII_NULL_CHAR = '\u0000'

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export default ({
  authorizationIdentity,
  accessKeyId,
  secretAccessKey,
  sessionToken = ''
}: any) => ({
  encode: async () => {
    return new Encoder().writeBytes(
      [authorizationIdentity, accessKeyId, secretAccessKey, sessionToken].join(US_ASCII_NULL_CHAR)
    )
  },
})
