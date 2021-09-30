import createAdmin from '../index'

import {
  sslConnectionOpts,
  saslEntries,
  createCluster,
  sslBrokers,
  saslBrokers,
  newLogger
} from 'testHelpers'

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
