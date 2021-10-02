/** @format */

import requestV5 from '../v5/request.ts';

/**
 * Metadata Request (Version: 6) => [topics] allow_auto_topic_creation
 *   topics => STRING
 *   allow_auto_topic_creation => BOOLEAN
 */

export default ({ topics, allowAutoTopicCreation = true }: any) =>
  Object.assign(requestV5({ topics, allowAutoTopicCreation }), {
    apiVersion: 6,
  });
