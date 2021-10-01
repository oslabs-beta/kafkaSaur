// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
const { createCluster, secureRandom } = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Cluster > findTopicPartitionMetadata', () => {
  let cluster: any, topic: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    topic = `test-topic-${secureRandom()}`
    cluster = createCluster()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('returns the partition metadata of a topic', () => {
    const partitionMetadata = [
      {
        isr: [2],
        leader: 2,
        partitionErrorCode: 0,
        partitionId: 0,
        replicas: [2],
      },
    ]
    cluster.brokerPool.metadata = { topicMetadata: [{ topic, partitionMetadata }] }
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.findTopicPartitionMetadata(topic)).toEqual(partitionMetadata)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('throws and error if the topicMetadata is not loaded', () => {
    cluster.brokerPool.metadata = null
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(() => cluster.findTopicPartitionMetadata(topic)).toThrowError(
      /Topic metadata not loaded/
    )

    cluster.brokerPool.metadata = {}
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(() => cluster.findTopicPartitionMetadata(topic)).toThrowError(
      /Topic metadata not loaded/
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('returns an empty array if there is no metadata for a given topic', () => {
    const partitionMetadata = [
      {
        isr: [2],
        leader: 2,
        partitionErrorCode: 0,
        partitionId: 0,
        replicas: [2],
      },
    ]
    cluster.brokerPool.metadata = { topicMetadata: [{ topic, partitionMetadata }] }
    const anotherTopic = `test-topic-${secureRandom()}`
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.findTopicPartitionMetadata(anotherTopic)).toEqual([])
  })
})
