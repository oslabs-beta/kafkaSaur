// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
const { newLogger } = require('testHelpers')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const Plain = require('./plain')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Broker > SASL Authenticator > PLAIN', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws KafkaJSSASLAuthenticationError for invalid username', async () => {
    const plain = new Plain({ sasl: {} }, newLogger())
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(plain.authenticate()).rejects.toThrow('Invalid username or password')
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws KafkaJSSASLAuthenticationError for invalid password', async () => {
    const plain = new Plain({ sasl: { username: '<username>' } }, newLogger())
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(plain.authenticate()).rejects.toThrow('Invalid username or password')
  })
})
