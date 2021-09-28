// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'OffsetMana... Remove this comment to see the full error message
const OffsetManager = require('../index')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer > OffsetMananger > countResolvedOffsets', () => {
  let offsetManager: any
  const resolveOffsets = (topic: any, partition: any, {
    count,
    startFrom = 0
  }: any) => {
    Array(count)
      // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
      .fill()
      .forEach((_: any, i: any) =>
        offsetManager.resolveOffset({
          topic,
          partition,
          offset: (startFrom + i).toString(),
        })
      )
  }

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
        committedOffsets: jest.fn(() => new Map()),
      },
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('counts the number of resolved offsets for all topics', () => {
    offsetManager.committedOffsets()['topic1'][0] = '-1'
    offsetManager.committedOffsets()['topic1'][1] = '-1'
    offsetManager.committedOffsets()['topic1'][2] = '-1'
    offsetManager.committedOffsets()['topic2'][5] = '-1'

    resolveOffsets('topic1', 0, { count: 10 })
    resolveOffsets('topic1', 1, { count: 1 })
    resolveOffsets('topic1', 2, { count: 3 })
    resolveOffsets('topic2', 5, { count: 6 })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(offsetManager.countResolvedOffsets().toString()).toEqual('20')
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('takes the committed offsets in consideration', () => {
    // committedOffsets will always have the next offset or -1
    offsetManager.committedOffsets()['topic1'][0] = '10'
    offsetManager.committedOffsets()['topic1'][1] = '1'
    offsetManager.committedOffsets()['topic1'][2] = '3'
    offsetManager.committedOffsets()['topic2'][5] = '5' // missing 1

    resolveOffsets('topic1', 0, { count: 10 })
    resolveOffsets('topic1', 1, { count: 1 })
    resolveOffsets('topic1', 2, { count: 3 })
    resolveOffsets('topic2', 5, { count: 6 })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(offsetManager.countResolvedOffsets().toString()).toEqual('1')
  })
})
