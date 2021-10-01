// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'OffsetMana... Remove this comment to see the full error message
const OffsetManager = require('../index')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer > OffsetMananger > uncommittedOffsets', () => {
  let offsetManager: any, topic1: any, topic2: any, memberAssignment: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    topic1 = 'topic-1'
    topic2 = 'topic-2'

    memberAssignment = {
      [topic1]: [0, 1],
      [topic2]: [0, 1, 2, 3],
    }

    offsetManager = new OffsetManager({ memberAssignment })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('returns all resolved offsets which have not been committed', () => {
    const defaultOffsetInt = 2

    Object.keys(memberAssignment).forEach(topic => {
      memberAssignment[topic].forEach((partition: any) => {
        offsetManager.resolveOffset({ topic, partition, offset: defaultOffsetInt.toString() })
      })
    })

    const defaultResolvedOffsetInt = defaultOffsetInt + 1

    // If committed offset equal to resolved offset, then partition is marked as committed
    offsetManager.committedOffsets()[topic2][0] = defaultResolvedOffsetInt.toString() // "committed"
    offsetManager.committedOffsets()[topic2][1] = (defaultResolvedOffsetInt - 1).toString() // not "committed"
    offsetManager.committedOffsets()[topic2][2] = (defaultResolvedOffsetInt + 1).toString() // not "committed"

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(offsetManager.uncommittedOffsets()).toEqual({
      topics: [
        {
          topic: topic1,
          partitions: [
            { partition: '0', offset: defaultResolvedOffsetInt.toString() },
            { partition: '1', offset: defaultResolvedOffsetInt.toString() },
          ],
        },
        {
          topic: topic2,
          partitions: [
            { partition: '1', offset: defaultResolvedOffsetInt.toString() },
            { partition: '2', offset: defaultResolvedOffsetInt.toString() },
            { partition: '3', offset: defaultResolvedOffsetInt.toString() },
          ],
        },
      ],
    })
  })
})
