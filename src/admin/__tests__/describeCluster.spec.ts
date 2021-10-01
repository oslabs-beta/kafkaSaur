// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createAdmi... Remove this comment to see the full error message
const createAdmin = require('../index')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
const { createCluster, newLogger } = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Admin', () => {
  let admin: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    admin && (await admin.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('describeCluster', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('retrieves metadata for all brokers in the cluster', async () => {
      const cluster = createCluster()
      admin = createAdmin({ cluster, logger: newLogger() })

      await admin.connect()
      const { brokers, clusterId, controller } = await admin.describeCluster()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokers).toHaveLength(3)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokers).toEqual(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.arrayContaining([
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect.objectContaining({
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            nodeId: expect.any(Number),
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            host: expect.any(String),
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            port: expect.any(Number),
          }),
        ])
      )
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(clusterId).toEqual(expect.any(String))
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokers.map(({
        nodeId
      }: any) => nodeId)).toContain(controller)
    })
  })
})
