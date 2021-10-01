// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ConsumerGr... Remove this comment to see the full error message
const ConsumerGroup = require('../consumerGroup')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
const { newLogger } = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('ConsumerGroup', () => {
  let consumerGroup: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    consumerGroup = new ConsumerGroup({
      logger: newLogger(),
      topics: ['topic1'],
      cluster: {},
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('uncommittedOffsets', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("calls the offset manager's uncommittedOffsets", async () => {
      const mockOffsets = { topics: [] }
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      consumerGroup.offsetManager = { uncommittedOffsets: jest.fn(() => mockOffsets) }

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumerGroup.uncommittedOffsets()).toStrictEqual(mockOffsets)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumerGroup.offsetManager.uncommittedOffsets).toHaveBeenCalled()
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('commitOffsets', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("calls the offset manager's commitOffsets", async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      consumerGroup.offsetManager = { commitOffsets: jest.fn(() => Promise.resolve()) }

      const offsets = { topics: [{ partitions: [{ offset: '0', partition: 0 }] }] }
      await consumerGroup.commitOffsets(offsets)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumerGroup.offsetManager.commitOffsets).toHaveBeenCalledTimes(1)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumerGroup.offsetManager.commitOffsets).toHaveBeenCalledWith(offsets)
    })
  })
})
