// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { DeleteTopics: apiKey } = require('../../apiKeys')

/**
 * DeleteTopics Request (Version: 0) => [topics] timeout
 *   topics => STRING
 *   timeout => INT32
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  topics,
  timeout = 5000
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'DeleteTopics',
  encode: async () => {
    return new Encoder().writeArray(topics).writeInt32(timeout)
  },
})
