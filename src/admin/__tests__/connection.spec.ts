// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createAdmi... Remove this comment to see the full error message
const createAdmin = require('../index')

const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sslConnect... Remove this comment to see the full error message
  sslConnectionOpts,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'saslEntrie... Remove this comment to see the full error message
  saslEntries,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
  createCluster,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sslBrokers... Remove this comment to see the full error message
  sslBrokers,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'saslBroker... Remove this comment to see the full error message
  saslBrokers,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Admin', () => {
  let admin: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    admin && (await admin.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('support SSL connections', async () => {
    const cluster = createCluster(sslConnectionOpts(), sslBrokers())
    admin = createAdmin({ cluster, logger: newLogger() })

    await admin.connect()
  })

  for (const e of saslEntries) {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test(`support SASL ${e.name} connections`, async () => {
      const cluster = createCluster(e.opts(), saslBrokers())
      admin = createAdmin({ cluster, logger: newLogger() })
      await admin.connect()
    })
  }
})
