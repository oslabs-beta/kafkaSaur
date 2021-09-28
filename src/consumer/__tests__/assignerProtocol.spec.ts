// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MemberMeta... Remove this comment to see the full error message
const { MemberMetadata, MemberAssignment } = require('../assignerProtocol')

// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
const FIXTURE_ROUND_ROBIN_METADATA = Buffer.from(
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require('./fixtures/roundRobinAssigner/memberMetadata.json')
)
// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
const FIXTURE_ROUND_ROBIN_ASSIGNER = Buffer.from(
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require('./fixtures/roundRobinAssigner/memberAssignment.json')
)

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer > assignerProtocol', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('MemberMetadata', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('encode', () => {
      const buffer = MemberMetadata.encode({
        version: 1,
        topics: ['topic-test'],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(buffer).toEqual(FIXTURE_ROUND_ROBIN_METADATA)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('decode', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(MemberMetadata.decode(FIXTURE_ROUND_ROBIN_METADATA)).toEqual({
        version: 1,
        topics: ['topic-test'],
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
        userData: Buffer.alloc(0),
      })
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('MemberAssignment', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('encode', () => {
      const buffer = MemberAssignment.encode({
        version: 1,
        assignment: { 'topic-test': [2, 5, 4, 1, 3, 0] },
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(buffer).toEqual(FIXTURE_ROUND_ROBIN_ASSIGNER)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('decode', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(MemberAssignment.decode(FIXTURE_ROUND_ROBIN_ASSIGNER)).toEqual({
        version: 1,
        assignment: { 'topic-test': [2, 5, 4, 1, 3, 0] },
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
        userData: Buffer.alloc(0),
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('decode empty assignment', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(MemberAssignment.decode(Buffer.from([]))).toBe(null)
    })
  })
})
