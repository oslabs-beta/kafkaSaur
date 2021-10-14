// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
const { newLogger } = require('testHelpers')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const OAuthBearer = require('./oauthBearer')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Broker > SASL Authenticator > OAUTHBEARER', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws KafkaJSSASLAuthenticationError for missing oauthBearerProvider', async () => {
    const oauthBearer = new OAuthBearer({ sasl: {} }, newLogger())
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(oauthBearer.authenticate()).rejects.toThrow('Missing OAuth bearer token provider')
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws KafkaJSSASLAuthenticationError for invalid OAuth bearer token', async () => {
    async function oauthBearerProvider() {
      return {}
    }

    const oauthBearer = new OAuthBearer({ sasl: { oauthBearerProvider } }, newLogger())
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(oauthBearer.authenticate()).rejects.toThrow('Invalid OAuth bearer token')
  })
})
