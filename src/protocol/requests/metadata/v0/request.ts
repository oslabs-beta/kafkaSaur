// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { Metadata: apiKey } = require('../../apiKeys')

/**
 * Metadata Request (Version: 0) => [topics]
 *   topics => STRING
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  topics
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'Metadata',
  encode: async () => {
    return new Encoder().writeArray(topics)
  },
})
