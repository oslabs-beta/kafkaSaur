// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { DescribeGroups: apiKey } = require('../../apiKeys')

/**
 * DescribeGroups Request (Version: 0) => [group_ids]
 *   group_ids => STRING
 */

/**
 * @param {Array} groupIds List of groupIds to request metadata for (an empty groupId array will return empty group metadata)
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
 groupIds
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'DescribeGroups',
  encode: async () => {
    return new Encoder().writeArray(groupIds)
  },
})
