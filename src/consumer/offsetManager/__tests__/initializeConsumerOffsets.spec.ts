// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'initialize... Remove this comment to see the full error message
const initializeConsumerOffsets = require('../initializeConsumerOffsets')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer > OffsetMananger > initializeConsumerOffsets', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('initialize consumer offsets assigned to -1 with topic offsets', () => {
    const consumerOffsets = [
      {
        topic: 'topic-name1',
        partitions: [
          { partition: 0, offset: '-1', metadata: '', errorCode: 0 },
          { partition: 1, offset: '-1', metadata: '', errorCode: 0 },
          { partition: 2, offset: '14', metadata: '', errorCode: 0 },
          { partition: 3, offset: '-1', metadata: '', errorCode: 0 },
        ],
      },
      {
        topic: 'topic-name2',
        partitions: [
          { partition: 0, offset: '-1', metadata: '', errorCode: 0 },
          { partition: 1, offset: '2', metadata: '', errorCode: 0 },
        ],
      },
    ]
    const topicOffsets = [
      {
        topic: 'topic-name1',
        partitions: [
          { partition: 0, offset: '-1', errorCode: 0 },
          { partition: 1, offset: '3', errorCode: 0 },
          { partition: 2, offset: '16', errorCode: 0 },
          { partition: 3, offset: '8', errorCode: 0 },
        ],
      },
      {
        topic: 'topic-name2',
        partitions: [
          { partition: 0, offset: '1', errorCode: 0 },
          { partition: 1, offset: '2', errorCode: 0 },
        ],
      },
    ]

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(initializeConsumerOffsets(consumerOffsets, topicOffsets)).toEqual([
      {
        topic: 'topic-name1',
        partitions: [
          { partition: 0, offset: '-1' },
          { partition: 1, offset: '3' },
          { partition: 2, offset: '14' },
          { partition: 3, offset: '8' },
        ],
      },
      {
        topic: 'topic-name2',
        partitions: [
          { partition: 0, offset: '1' },
          { partition: 1, offset: '2' },
        ],
      },
    ])
  })
})
