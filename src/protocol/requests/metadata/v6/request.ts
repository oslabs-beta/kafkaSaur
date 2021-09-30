// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestV5'... Remove this comment to see the full error message
const requestV5 = require('../v5/request')

/**
 * Metadata Request (Version: 6) => [topics] allow_auto_topic_creation
 *   topics => STRING
 *   allow_auto_topic_creation => BOOLEAN
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
 topics,
 allowAutoTopicCreation = true
}: any) =>
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  Object.assign(requestV5({ topics, allowAutoTopicCreation }), { apiVersion: 6 })
