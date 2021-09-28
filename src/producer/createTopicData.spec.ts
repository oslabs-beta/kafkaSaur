// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTopi... Remove this comment to see the full error message
const createTopicData = require('./createTopicData')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Producer > createTopicData', () => {
  let topic: any, partitions: any, messagesPerPartition: any, sequencePerPartition: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    topic = 'test-topic'
    partitions = [1, 2, 3]

    messagesPerPartition = {
      1: [{ key: '1' }],
      2: [{ key: '2' }],
      3: [{ key: '3' }, { key: '4' }],
    }

    sequencePerPartition = {
      1: 0,
      2: 5,
      3: 10,
    }
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('format data by topic and partition', () => {
    const result = createTopicData([
      { topic, partitions, messagesPerPartition, sequencePerPartition },
    ])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(result).toEqual([
      {
        topic,
        partitions: [
          { partition: 1, firstSequence: 0, messages: [{ key: '1' }] },
          { partition: 2, firstSequence: 5, messages: [{ key: '2' }] },
          { partition: 3, firstSequence: 10, messages: [{ key: '3' }, { key: '4' }] },
        ],
      },
    ])
  })
})
