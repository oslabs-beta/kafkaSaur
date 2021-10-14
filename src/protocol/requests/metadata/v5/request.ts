/** @format */

import requestV4 from '../v4/request.ts';

/**
 * Metadata Request (Version: 5) => [topics] allow_auto_topic_creation
 *   topics => STRING
 *   allow_auto_topic_creation => BOOLEAN
 */

export default ({ topics, allowAutoTopicCreation = true }: any) =>
  Object.assign(requestV4({ topics, allowAutoTopicCreation }), {
    apiVersion: 5,
  });
