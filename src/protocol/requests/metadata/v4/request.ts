// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { Metadata: apiKey } = require('../../apiKeys')

/**
 * Metadata Request (Version: 4) => [topics] allow_auto_topic_creation
 *   topics => STRING
 *   allow_auto_topic_creation => BOOLEAN
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  topics,
  allowAutoTopicCreation = true
}: any) => ({
  apiKey,
  apiVersion: 4,
  apiName: 'Metadata',
  encode: async () => {
    return new Encoder().writeNullableArray(topics).writeBoolean(allowAutoTopicCreation)
  },
})
