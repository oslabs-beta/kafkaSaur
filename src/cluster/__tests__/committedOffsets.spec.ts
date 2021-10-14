// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
const { createCluster } = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Cluster', () => {
  let groupId: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    groupId = 'test-group-id'
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('if no offset map is provided', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return all committed offsets by group', async () => {
      const cluster = createCluster({})
      const topic = 'test-topic'
      const partition = 0

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.committedOffsets({ groupId })).toEqual({})

      cluster.markOffsetAsCommitted({ groupId, topic, partition, offset: '100' })
      cluster.markOffsetAsCommitted({ groupId: 'foobar', topic, partition, offset: '999' })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.committedOffsets({ groupId })).toEqual({ [topic]: { [partition]: '100' } })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.committedOffsets({ groupId: 'foobar' })).toEqual({
        [topic]: { [partition]: '999' },
      })
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('if an offset map is provided', () => {
    let offsets: any

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Map'. Do you need to change your... Remove this comment to see the full error message
      offsets = new Map()
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return all committed offsets by group', async () => {
      const cluster = createCluster({ offsets })
      const topic = 'test-topic'
      const partition = 0

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.committedOffsets({ groupId })).toEqual({})

      cluster.markOffsetAsCommitted({ groupId, topic, partition, offset: '100' })
      cluster.markOffsetAsCommitted({ groupId: 'foobar', topic, partition, offset: '999' })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.committedOffsets({ groupId })).toEqual({ [topic]: { [partition]: '100' } })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.committedOffsets({ groupId: 'foobar' })).toEqual({
        [topic]: { [partition]: '999' },
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should use the provided offsets map', async () => {
      const cluster = createCluster({ offsets })
      const topic = 'test-topic'
      const partition = 0

      cluster.markOffsetAsCommitted({ groupId, topic, partition, offset: '100' })
      cluster.markOffsetAsCommitted({ groupId: 'foobar', topic, partition, offset: '999' })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.committedOffsets({ groupId })).toEqual({ [topic]: { [partition]: '100' } })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsets.get(groupId)).toEqual({ [topic]: { [partition]: '100' } })
    })
  })
})
