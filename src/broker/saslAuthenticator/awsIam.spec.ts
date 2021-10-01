// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
const { newLogger } = require('testHelpers')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const AWSIAM = require('./awsIam')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Broker > SASL Authenticator > AWS-IAM', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws KafkaJSSASLAuthenticationError for missing authorizationIdentity', async () => {
    const awsIam = new AWSIAM({ sasl: {} }, newLogger())
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(awsIam.authenticate()).rejects.toThrow(
      'SASL AWS-IAM: Missing authorizationIdentity'
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws KafkaJSSASLAuthenticationError for invalid accessKeyId', async () => {
    const awsIam = new AWSIAM(
      {
        sasl: {
          authorizationIdentity: '<authorizationIdentity>',
          secretAccessKey: '<secretAccessKey>',
        },
      },
      newLogger()
    )
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(awsIam.authenticate()).rejects.toThrow('SASL AWS-IAM: Missing accessKeyId')
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws KafkaJSSASLAuthenticationError for invalid secretAccessKey', async () => {
    const awsIam = new AWSIAM(
      { sasl: { authorizationIdentity: '<authorizationIdentity>', accessKeyId: '<accessKeyId>' } },
      newLogger()
    )
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(awsIam.authenticate()).rejects.toThrow('SASL AWS-IAM: Missing secretAccessKey')
  })
})
