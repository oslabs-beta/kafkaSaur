/** @format */

import {Encoder} from '../../../encoder.ts';
import apiKeys from '../../apiKeys.ts';

const apiKey = apiKeys.Metadata;
/**
 * Metadata Request (Version: 4) => [topics] allow_auto_topic_creation
 *   topics => STRING
 *   allow_auto_topic_creation => BOOLEAN
 */

export default ({ topics, allowAutoTopicCreation = true }: any) => ({
  apiKey,
  apiVersion: 4,
  apiName: 'Metadata',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder()
      .writeNullableArray(topics)
      .writeBoolean(allowAutoTopicCreation);
  },
});
