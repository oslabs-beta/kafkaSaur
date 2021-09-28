// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const JoinGroupVersions = require('./index')
const JoinGroupV0 = JoinGroupVersions.protocol({ version: 0 })
const JoinGroupV1 = JoinGroupVersions.protocol({ version: 1 })
const JoinGroupV2 = JoinGroupVersions.protocol({ version: 2 })
const JoinGroupV3 = JoinGroupVersions.protocol({ version: 3 })
const JoinGroupV4 = JoinGroupVersions.protocol({ version: 4 })

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > JoinGroup', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('v0', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the requestTimeout', () => {
      const sessionTimeout = 30000
      const protocol = JoinGroupV0({
        groupId: 'test-group',
        sessionTimeout,
        memberId: '',
        protocolType: 'consumer',
        groupProtocols: [{ name: 'default' }],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(protocol.requestTimeout).toBeGreaterThan(sessionTimeout)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not use numbers large than MAX_SAFE_INTEGER', () => {
      const protocol = JoinGroupV0({
    groupId: 'test-group',
    sessionTimeout: (Number as any).MAX_SAFE_INTEGER,
    memberId: '',
    protocolType: 'consumer',
    groupProtocols: [{ name: 'default' }],
});

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(protocol.requestTimeout).toEqual((Number as any).MAX_SAFE_INTEGER);
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('v1+', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('uses the rebalanceTimeout for the requestTimeout when set', () => {
      const sessionTimeout = 1
      const rebalanceTimeout = 30000
      const parameters = {
        groupId: 'test-group',
        sessionTimeout,
        rebalanceTimeout,
        memberId: '',
        protocolType: 'consumer',
        groupProtocols: [{ name: 'default' }],
      }
      const protocolV1 = JoinGroupV1(parameters)
      const protocolV2 = JoinGroupV2(parameters)
      const protocolV3 = JoinGroupV3(parameters)
      const protocolV4 = JoinGroupV4(parameters)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(protocolV1.requestTimeout).toBeGreaterThan(rebalanceTimeout)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(protocolV2.requestTimeout).toBeGreaterThan(rebalanceTimeout)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(protocolV3.requestTimeout).toBeGreaterThan(rebalanceTimeout)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(protocolV4.requestTimeout).toBeGreaterThan(rebalanceTimeout)
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('v4+', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not log error responses when memberId is empty', () => {
      const protocol = JoinGroupV4({
        groupId: 'test-group',
        sessionTimeout: 1,
        rebalanceTimeout: 30000,
        memberId: '',
        protocolType: 'consumer',
        groupProtocols: [{ name: 'default' }],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(protocol.logResponseError).toEqual(false)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('logs error responses when memberId is not empty', () => {
      const protocol = JoinGroupV4({
        groupId: 'test-group',
        sessionTimeout: 1,
        rebalanceTimeout: 30000,
        memberId: 'member-id',
        protocolType: 'consumer',
        groupProtocols: [{ name: 'default' }],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(protocol.logResponseError).toEqual(true)
    })
  })
})
