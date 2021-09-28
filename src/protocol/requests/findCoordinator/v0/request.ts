// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { GroupCoordinator: apiKey } = require('../../apiKeys')

/**
 * FindCoordinator Request (Version: 0) => group_id
 *   group_id => STRING
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
  groupId
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'GroupCoordinator',
  encode: async () => {
    return new Encoder().writeString(groupId)
  },
})
