// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
const { createCluster, secureRandom, createTopic } = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Cluster > metadata', () => {
  let cluster: any, topic1: any, topic2: any, topic3: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topic1 = `test-topic-${secureRandom()}`
    topic2 = `test-topic-${secureRandom()}`
    topic3 = `test-topic-${secureRandom()}`

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topic1 })
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topic2 })
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topic3 })

    cluster = createCluster()
    await cluster.connect()
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    cluster && (await cluster.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('returns metadata for a set of topics', async () => {
    const response = await cluster.metadata({ topics: [topic1, topic2] })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response.topicMetadata.length).toEqual(2)

    const topics = response.topicMetadata.map(({
      topic
    }: any) => topic).sort()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(topics).toEqual([topic1, topic2].sort())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('returns metadata for all topics', async () => {
    const response = await cluster.metadata({ topics: [] })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response.topicMetadata.length).toBeGreaterThanOrEqual(3)

    const topics = response.topicMetadata.map(({
      topic
    }: any) => topic).sort()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(topics).toEqual(expect.arrayContaining([topic1, topic2, topic3].sort()))
  })
})
