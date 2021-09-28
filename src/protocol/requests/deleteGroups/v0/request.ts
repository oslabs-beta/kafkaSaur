// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { DeleteGroups: apiKey } = require('../../apiKeys')

/**
 * DeleteGroups Request (Version: 0) => [groups_names]
 *   groups_names => STRING
 */

/**
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = (groupIds: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'DeleteGroups',

  encode: async () => {
    return new Encoder().writeArray(groupIds.map(encodeGroups))
  }
})

const encodeGroups = (group: any) => {
  return new Encoder().writeString(group)
}
