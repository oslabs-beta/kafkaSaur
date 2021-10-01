// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const RoundRobinAssigner = require('./index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MemberAssi... Remove this comment to see the full error message
const { MemberAssignment, MemberMetadata } = require('../../assignerProtocol')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer > assigners > RoundRobinAssigner', () => {
  let cluster, topics: any, metadata: any, assigner: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    metadata = {}
    cluster = { findTopicPartitionMetadata: (topic: any) => metadata[topic] }
    assigner = RoundRobinAssigner({ cluster })
    topics = ['topic-A', 'topic-B']
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#assign', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('assign all topic-partitions evenly', async () => {
      metadata['topic-A'] = Array(14)
        // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
        .fill()
        // @ts-expect-error ts-migrate(7006) FIXME: Parameter '_' implicitly has an 'any' type.
        .map((_, i) => ({
        partitionId: i
      }))

      metadata['topic-B'] = Array(5)
        // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
        .fill()
        // @ts-expect-error ts-migrate(7006) FIXME: Parameter '_' implicitly has an 'any' type.
        .map((_, i) => ({
        partitionId: i
      }))

      const members = [
        { memberId: 'member-3' },
        { memberId: 'member-1' },
        { memberId: 'member-4' },
        { memberId: 'member-2' },
      ]

      const assignment = await assigner.assign({ members, topics })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(assignment).toEqual([
        {
          memberId: 'member-1',
          memberAssignment: MemberAssignment.encode({
            version: assigner.version,
            assignment: {
              'topic-A': [0, 4, 8, 12],
              'topic-B': [2],
            },
          }),
        },
        {
          memberId: 'member-2',
          memberAssignment: MemberAssignment.encode({
            version: assigner.version,
            assignment: {
              'topic-A': [1, 5, 9, 13],
              'topic-B': [3],
            },
          }),
        },
        {
          memberId: 'member-3',
          memberAssignment: MemberAssignment.encode({
            version: assigner.version,
            assignment: {
              'topic-A': [2, 6, 10],
              'topic-B': [0, 4],
            },
          }),
        },
        {
          memberId: 'member-4',
          memberAssignment: MemberAssignment.encode({
            version: assigner.version,
            assignment: {
              'topic-A': [3, 7, 11],
              'topic-B': [1],
            },
          }),
        },
      ])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('assign topics with names taken from builtin functions', async () => {
      topics = ['shift', 'toString']
      metadata['shift'] = [{ partitionId: 0 }]
      metadata['toString'] = [{ partitionId: 0 }]
      const members = [{ memberId: 'member-1' }]

      const assignment = await assigner.assign({ members, topics })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(assignment).toEqual([
        {
          memberId: 'member-1',
          memberAssignment: MemberAssignment.encode({
            version: assigner.version,
            assignment: {
              shift: [0],
              toString: [0],
            },
          }),
        },
      ])
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#protocol', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('returns the assigner name and metadata', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(assigner.protocol({ topics })).toEqual({
        name: assigner.name,
        metadata: MemberMetadata.encode({ version: assigner.version, topics }),
      })
    })
  })
})
