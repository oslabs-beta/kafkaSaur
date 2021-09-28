// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createCons... Remove this comment to see the full error message
const createConsumer = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSNon... Remove this comment to see the full error message
const { KafkaJSNonRetriableError } = require('../../errors')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
const { createCluster, newLogger } = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws when heartbeatInterval is lower or equal to sessionTimeout', () => {
    const errorMessage =
      'Consumer heartbeatInterval (10000) must be lower than sessionTimeout (10000). It is recommended to set heartbeatInterval to approximately a third of the sessionTimeout.'

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(() =>
      createConsumer({
        cluster: createCluster(),
        logger: newLogger(),
        groupId: 'test-group-id',
        heartbeatInterval: 10000,
        sessionTimeout: 10000,
      })
    ).toThrowWithMessage(KafkaJSNonRetriableError, errorMessage)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws when groupId is missing', () => {
    const errorMessage = 'Consumer groupId must be a non-empty string.'

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(() =>
      createConsumer({
        cluster: createCluster(),
        logger: newLogger(),
      })
    ).toThrowWithMessage(KafkaJSNonRetriableError, errorMessage)
  })
})
