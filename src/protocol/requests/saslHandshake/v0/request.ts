// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { SaslHandshake: apiKey } = require('../../apiKeys')

/**
 * SaslHandshake Request (Version: 0) => mechanism
 *    mechanism => STRING
 */

/**
 * @param {string} mechanism - SASL Mechanism chosen by the client
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
 mechanism
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'SaslHandshake',
  encode: async () => new Encoder().writeString(mechanism),
})
