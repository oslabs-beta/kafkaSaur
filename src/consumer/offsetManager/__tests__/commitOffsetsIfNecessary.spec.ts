// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Long'.
const Long = require('../../../utils/long')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sleep'.
const sleep = require('../../../utils/sleep')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'OffsetMana... Remove this comment to see the full error message
const OffsetManager = require('../index')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer > OffsetMananger > commitOffsetsIfNecessary', () => {
  let offsetManager: any, mockCommitOffsets: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    const memberAssignment = {
      topic1: [0, 1, 2, 3],
      topic2: [0, 1, 2, 3, 4, 5],
    }

    offsetManager = new OffsetManager({
      memberAssignment,
      cluster: {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        committedOffsets: jest.fn(() => ({})),
      },
    })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    offsetManager.commitOffsets = jest.fn()
    offsetManager.committedOffsets()['topic1'][0] = '-1'

    mockCommitOffsets = () => {
      const committedOffsets = offsetManager.committedOffsets()

      for (const topic in offsetManager.resolvedOffsets) {
        committedOffsets[topic] = {}
        for (const partition in offsetManager.resolvedOffsets[topic]) {
          committedOffsets[topic][partition] = offsetManager.resolvedOffsets[topic][partition]
        }
      }
      offsetManager.lastCommit = Date.now()
    }
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when autoCommitInterval and autoCommitThreshold are undefined', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not commit offsets', async () => {
      offsetManager.autoCommitInterval = undefined
      offsetManager.autoCommitThreshold = undefined
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      offsetManager.countResolvedOffsets = jest.fn(() => Long.fromValue(0))

      await offsetManager.commitOffsetsIfNecessary()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsetManager.commitOffsets).not.toHaveBeenCalled()
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when autoCommitInterval is defined', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('commits the offsets whenever the interval is reached', async () => {
      offsetManager.autoCommitInterval = 30
      offsetManager.autoCommitThreshold = undefined
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      offsetManager.countResolvedOffsets = jest.fn(() => Long.fromValue(0))
      offsetManager.commitOffsets.mockImplementation(() => {
        offsetManager.lastCommit = Date.now()
      })

      await offsetManager.commitOffsetsIfNecessary()
      await sleep(50)

      await offsetManager.commitOffsetsIfNecessary()
      await offsetManager.commitOffsetsIfNecessary()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsetManager.commitOffsets).toHaveBeenCalledTimes(1)
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when autoCommitThreshold is defined', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('commits the offsets whenever the threshold is reached', async () => {
      offsetManager.autoCommitInterval = undefined
      offsetManager.autoCommitThreshold = 3
      offsetManager.commitOffsets.mockImplementation(mockCommitOffsets)

      await offsetManager.commitOffsetsIfNecessary()
      offsetManager.resolveOffset({ topic: 'topic1', partition: 0, offset: '3' })

      await offsetManager.commitOffsetsIfNecessary()
      await offsetManager.commitOffsetsIfNecessary()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsetManager.commitOffsets).toHaveBeenCalledTimes(1)
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when autoCommitInterval and autoCommitThreshold are defined', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      offsetManager.commitOffsets.mockImplementation(mockCommitOffsets)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('commits the offsets if the interval is reached before the threshold', async () => {
      offsetManager.autoCommitInterval = 10
      offsetManager.autoCommitThreshold = 25

      offsetManager.resolveOffset({ topic: 'topic1', partition: 0, offset: '3' })
      await sleep(15)

      await offsetManager.commitOffsetsIfNecessary()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsetManager.commitOffsets).toHaveBeenCalledTimes(1)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('commits the offsets if the threshold is reached before the timeout', async () => {
      offsetManager.autoCommitInterval = 500
      offsetManager.autoCommitThreshold = 2

      offsetManager.resolveOffset({ topic: 'topic1', partition: 0, offset: '3' })
      await sleep(15)

      await offsetManager.commitOffsetsIfNecessary()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsetManager.commitOffsets).toHaveBeenCalledTimes(1)
    })
  })
})
