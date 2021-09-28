// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { ApiVersions: apiKey } = require('../../apiKeys')

/**
 * ApiVersionRequest => ApiKeys
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = () => ({
  apiKey,
  apiVersion: 0,
  apiName: 'ApiVersions',
  encode: async () => new Encoder(),
})
