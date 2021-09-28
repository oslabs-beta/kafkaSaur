// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { GroupCoordinator: apiKey } = require('../../apiKeys')

/**
 * FindCoordinator Request (Version: 1) => coordinator_key coordinator_type
 *   coordinator_key => STRING
 *   coordinator_type => INT8
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
  coordinatorKey,
  coordinatorType
}: any) => ({
  apiKey,
  apiVersion: 1,
  apiName: 'GroupCoordinator',
  encode: async () => {
    return new Encoder().writeString(coordinatorKey).writeInt8(coordinatorType)
  },
})
