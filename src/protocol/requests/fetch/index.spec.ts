// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const FetchVersions = require('./index')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > Fetch', () => {
  for (const version of FetchVersions.versions) {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe(version, () => {
      const Fetch = FetchVersions.protocol({ version })
      const maxBytes = 1048576 // 1MB
      const topics = [
        {
          topic: 'test-topic',
          partitions: [
            {
              partition: 0,
              fetchOffset: 0,
              maxBytes,
            },
          ],
        },
      ]

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns the requestTimeout', () => {
        const maxWaitTime = 1000
        const protocol = Fetch({
          maxWaitTime,
          minBytes: 1,
          maxBytes: 1024,
          topics,
        })

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(protocol.requestTimeout).toBeGreaterThan(maxWaitTime)
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('does not use numbers large than MAX_SAFE_INTEGER', () => {
        const protocol = Fetch({
    maxWaitTime: (Number as any).MAX_SAFE_INTEGER,
    minBytes: 1,
    maxBytes: 1024,
    topics,
});

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(protocol.requestTimeout).toEqual((Number as any).MAX_SAFE_INTEGER);
      })
    })
  }
})
