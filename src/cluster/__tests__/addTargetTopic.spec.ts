// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
const { createCluster, secureRandom, createTopic } = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Cluster > addTargetTopic', () => {
  let cluster: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    cluster = createCluster()
    await cluster.connect()
    cluster.brokerPool.metadata = { some: 'metadata' }
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    cluster && (await cluster.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('add the new topic to the target list', async () => {
    const topic1 = `topic-${secureRandom()}`
    const topic2 = `topic-${secureRandom()}`
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topic1 })
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topic2 })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(Array.from(cluster.targetTopics)).toEqual([])

    await cluster.addTargetTopic(topic1)
    await cluster.addTargetTopic(topic1)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(Array.from(cluster.targetTopics)).toEqual([topic1])

    await cluster.addTargetTopic(topic2)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(Array.from(cluster.targetTopics)).toEqual([topic1, topic2])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('refresh metadata if the list of topics has changed', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    cluster.refreshMetadata = jest.fn()
    const topic1 = `topic-${secureRandom()}`
    await cluster.addTargetTopic(topic1)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.refreshMetadata).toHaveBeenCalled()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('refresh metadata if no metadata was loaded before', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    cluster.refreshMetadata = jest.fn()
    const topic1 = `topic-${secureRandom()}`
    await cluster.addTargetTopic(topic1)
    await cluster.addTargetTopic(topic1)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.refreshMetadata).toHaveBeenCalledTimes(1)

    cluster.brokerPool.metadata = null
    await cluster.addTargetTopic(topic1)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.refreshMetadata).toHaveBeenCalledTimes(2)
  })
})
