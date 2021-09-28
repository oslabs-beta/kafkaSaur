// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createAdmi... Remove this comment to see the full error message
const createAdmin = require('../index')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
const { secureRandom, createCluster, newLogger } = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Admin', () => {
  let cluster, admin: any, existingTopicNames: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    cluster = createCluster()
    admin = createAdmin({ cluster: cluster, logger: newLogger() })
    existingTopicNames = [
      `test-topic-${secureRandom()}`,
      `test-topic-${secureRandom()}`,
      `test-topic-${secureRandom()}`,
    ]
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'n' implicitly has an 'any' type.
    const topics = existingTopicNames.map(n => ({
      topic: n,
    }))
    await admin.createTopics({ topics })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    if (admin) {
      await admin.deleteTopics({ topics: existingTopicNames })
      await admin.disconnect()
    }
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('listTopics', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('list topics', async () => {
      const listTopicsResponse = await admin.listTopics()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(listTopicsResponse).toEqual(expect.arrayContaining(existingTopicNames))
    })
  })
})
