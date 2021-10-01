// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { ListGroups: apiKey } = require('../../apiKeys')

/**
 * ListGroups Request (Version: 0)
 */

/**
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export () => ({
  apiKey,
  apiVersion: 0,
  apiName: 'ListGroups',
  encode: async () => {
    return new Encoder()
  },
})
