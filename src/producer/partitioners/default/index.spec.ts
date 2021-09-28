// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createPartitioner = require('./index')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Producer > Partitioner > Default', () => {
  let topic: any, partitioner: any, partitionMetadata: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    topic = 'test-topic-1'
    partitioner = createPartitioner()

    // Intentionally make the partition list not in partition order
    // to test the edge cases
    partitionMetadata = [
      { partitionId: 1, leader: 1 },
      { partitionId: 2, leader: 2 },
      { partitionId: 0, leader: 0 },
    ]
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('same key yields same partition', () => {
    const partitionA = partitioner({ topic, partitionMetadata, message: { key: 'test-key' } })
    const partitionB = partitioner({ topic, partitionMetadata, message: { key: 'test-key' } })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(partitionA).toEqual(partitionB)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('round-robin with unavailable partitions', () => {
    partitionMetadata[0].leader = -1
    let countForPartition0 = 0
    let countForPartition2 = 0

    for (let i = 1; i <= 100; i++) {
      const partition = partitioner({ topic, partitionMetadata, message: {} })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect([0, 2]).toContain(partition)
      partition === 0 ? countForPartition0++ : countForPartition2++
    }

    // The distribution between two available partitions should be even
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(countForPartition0).toEqual(countForPartition2)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('round-robin', () => {
    const partitionCount = {}

    for (let i = 0; i < 30; ++i) {
      const partition = partitioner({ topic, partitionMetadata, message: {} })
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      const count = partitionCount[partition] || 0
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      partitionCount[partition] = count + 1
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(partitionCount[0]).toEqual(10)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(partitionCount[1]).toEqual(10)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(partitionCount[2]).toEqual(10)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('returns the configured partition if it exists', () => {
    const partition = partitioner({
      topic,
      partitionMetadata,
      message: { key: '1', partition: 99 },
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(partition).toEqual(99)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('returns the configured partition even if the partition is falsy', () => {
    const partition = partitioner({
      topic,
      partitionMetadata,
      message: { key: '1', partition: 0 },
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(partition).toEqual(0)
  })
})
