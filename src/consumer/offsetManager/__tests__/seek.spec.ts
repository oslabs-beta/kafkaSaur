// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'OffsetMana... Remove this comment to see the full error message
const OffsetManager = require('../index')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer > OffsetMananger > seek', () => {
  let offsetManager: any, coordinator: any
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    const memberAssignment = {
      topic1: [0, 1, 2, 3],
      topic2: [0, 1, 2, 3, 4, 5],
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    coordinator = { offsetCommit: jest.fn() }
    offsetManager = new OffsetManager({ memberAssignment })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    offsetManager.getCoordinator = jest.fn(() => coordinator)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('ignores the seek when the consumer is not assigned to the topic', async () => {
    await offsetManager.seek({ topic: 'topic3', partition: 0, offset: '100' })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(offsetManager.getCoordinator).not.toHaveBeenCalled()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(coordinator.offsetCommit).not.toHaveBeenCalled()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('ignores the seek when the consumer is not assigned to the partition', async () => {
    await offsetManager.seek({ topic: 'topic1', partition: 4, offset: '101' })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(offsetManager.getCoordinator).not.toHaveBeenCalled()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(coordinator.offsetCommit).not.toHaveBeenCalled()
  })
})
