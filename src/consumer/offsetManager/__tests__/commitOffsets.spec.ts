// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'OffsetMana... Remove this comment to see the full error message
const OffsetManager = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Instrument... Remove this comment to see the full error message
const InstrumentationEventEmitter = require('../../../instrumentation/emitter')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createErro... Remove this comment to see the full error message
const { createErrorFromCode } = require('../../../protocol/error')
const NOT_COORDINATOR_FOR_GROUP_CODE = 16

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer > OffsetMananger > commitOffsets', () => {
  let offsetManager: any,
    topic1: any,
    topic2: any,
    memberAssignment: any,
    mockCluster: any,
    mockCoordinator: any,
    groupId: any,
    generationId: any,
    memberId: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    topic1 = 'topic-1'
    topic2 = 'topic-2'
    groupId = 'groupId'
    generationId = 'generationId'
    memberId = 'memberId'

    memberAssignment = {
      [topic1]: [0, 1],
      [topic2]: [0, 1, 2, 3],
    }

    mockCluster = {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      committedOffsets: jest.fn(() => ({})),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      refreshMetadata: jest.fn(() => ({})),
    }

    mockCoordinator = {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      offsetCommit: jest.fn(),
    }

    offsetManager = new OffsetManager({
      cluster: mockCluster,
      memberAssignment,
      groupId,
      generationId,
      memberId,
      instrumentationEmitter: new InstrumentationEventEmitter(),
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    offsetManager.getCoordinator = jest.fn(() => mockCoordinator)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('commits all the resolved offsets that have not already been committed', async () => {
    const defaultOffsetInt = 2

    Object.keys(memberAssignment).forEach(topic => {
      memberAssignment[topic].forEach((partition: any) => {
        offsetManager.resolveOffset({ topic, partition, offset: defaultOffsetInt.toString() })
      })
    })

    const defaultResolvedOffsetInt = defaultOffsetInt + 1
    const defaultResolvedOffsetStr = defaultResolvedOffsetInt.toString()

    // If committed offset equal to resolved offset, then partition is marked as committed
    offsetManager.committedOffsets()[topic2][0] = defaultResolvedOffsetInt.toString() // "committed"

    await offsetManager.commitOffsets()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(mockCoordinator.offsetCommit).toHaveBeenCalledWith({
      groupId,
      memberId,
      groupGenerationId: generationId,
      topics: [
        {
          topic: topic1,
          partitions: [
            { partition: '0', offset: defaultResolvedOffsetStr },
            { partition: '1', offset: defaultResolvedOffsetStr },
          ],
        },
        {
          topic: topic2,
          partitions: [
            { partition: '1', offset: defaultResolvedOffsetStr },
            { partition: '2', offset: defaultResolvedOffsetStr },
            { partition: '3', offset: defaultResolvedOffsetStr },
          ],
        },
      ],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(offsetManager.committedOffsets()).toEqual({
      'topic-1': {
        '0': defaultResolvedOffsetStr,
        '1': defaultResolvedOffsetStr,
      },
      'topic-2': {
        '0': defaultResolvedOffsetStr,
        '1': defaultResolvedOffsetStr,
        '2': defaultResolvedOffsetStr,
        '3': defaultResolvedOffsetStr,
      },
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('commits any provided offsets', async () => {
    const offset = Math.random().toString()
    const offsets = { topics: [{ topic: topic1, partitions: [{ partition: '0', offset }] }] }
    await offsetManager.commitOffsets(offsets)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(mockCoordinator.offsetCommit).toHaveBeenCalledWith({
      groupId,
      memberId,
      groupGenerationId: generationId,
      topics: [
        {
          topic: topic1,
          partitions: [{ partition: '0', offset }],
        },
      ],
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('refreshes metadata on NOT_COORDINATOR_FOR_GROUP protocol error', async () => {
    mockCoordinator.offsetCommit.mockImplementation(() => {
      throw createErrorFromCode(NOT_COORDINATOR_FOR_GROUP_CODE)
    })

    const offset = Math.random().toString()
    const offsets = { topics: [{ topic: topic1, partitions: [{ partition: '0', offset }] }] }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(offsetManager.commitOffsets(offsets)).rejects.toThrow()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(mockCluster.refreshMetadata).toHaveBeenCalled()
  })
})
