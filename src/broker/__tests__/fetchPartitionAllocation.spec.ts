// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.mock('../../utils/shuffle', () => jest.fn())

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Broker'.
const Broker = require('../index')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const mockShuffle = require('../../utils/shuffle')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createConn... Remove this comment to see the full error message
const { createConnection, newLogger } = require('testHelpers')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'minBytes'.
const minBytes = 1
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'maxBytes'.
const maxBytes = 10485760 // 10MB
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'maxBytesPe... Remove this comment to see the full error message
const maxBytesPerPartition = 1048576 // 1MB
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'maxWaitTim... Remove this comment to see the full error message
const maxWaitTime = 100

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Broker > Fetch', () => {
  let broker: any, connection, fetchRequestMock: any

  const createFetchTopic = (name: any, numPartitions: any) => {
    const partitions = Array(numPartitions)
      // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
      .fill()
      // @ts-expect-error ts-migrate(7006) FIXME: Parameter '_' implicitly has an 'any' type.
      .map((_, i) => ({
      partition: i,
      fetchOffset: 0,
      maxBytes: maxBytesPerPartition
    }))

    return {
      topic: name,
      partitions,
    }
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    connection = createConnection()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    connection.send = jest.fn()
    broker = new Broker({
      connection,
      logger: newLogger(),
    })

    broker.lookupRequest = () => fetchRequestMock
  })

  /**
   * When requesting data for topic-partitions with more data than `maxBytes`,
   * the response will be allocated in the order
   * the topic-partitions appear in the request. To avoid biasing consumption,
   * the order of all topic-partitions is randomized on each request.
   *
   * @see https://cwiki.apache.org/confluence/display/KAFKA/KIP-74%3A+Add+Fetch+Response+Size+Limit+in+Bytes
   */
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('it should randomize the order of the requested topic-partitions', async () => {
    const topics = [createFetchTopic('topic-a', 3), createFetchTopic('topic-b', 2)]
    const flattened = [
      { topic: topics[0].topic, partition: topics[0].partitions[0] },
      { topic: topics[0].topic, partition: topics[0].partitions[1] },
      { topic: topics[0].topic, partition: topics[0].partitions[2] },
      { topic: topics[1].topic, partition: topics[1].partitions[0] },
      { topic: topics[1].topic, partition: topics[1].partitions[1] },
    ]

    mockShuffle.mockImplementationOnce(() => [
      flattened[0],
      flattened[3],
      // test that consecutive partitions for same topic are merged
      flattened[1],
      flattened[2],
      flattened[4],
    ])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    fetchRequestMock = jest.fn()

    await broker.fetch({ maxWaitTime, minBytes, maxBytes, topics })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(mockShuffle).toHaveBeenCalledWith(flattened)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(fetchRequestMock).toHaveBeenCalledWith(
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect.objectContaining({
        topics: [
          { topic: topics[0].topic, partitions: [topics[0].partitions[0]] },
          { topic: topics[1].topic, partitions: [topics[1].partitions[0]] },
          {
            topic: topics[0].topic,
            partitions: [topics[0].partitions[1], topics[0].partitions[2]],
          },
          { topic: topics[1].topic, partitions: [topics[1].partitions[1]] },
        ],
      })
    )
  })
})
