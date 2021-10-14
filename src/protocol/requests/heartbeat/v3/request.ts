/** @format */

import { Encoder } from '../../../encoder.ts';
import apiKeys from '../../apiKeys.ts';
const apiKey = apiKeys.Heartbeat;
/**
 * Version 3 adds group_instance_id to indicate member identity across restarts.
 * @see https://cwiki.apache.org/confluence/display/KAFKA/KIP-345%3A+Introduce+static+membership+protocol+to+reduce+consumer+rebalances
 *
 * Heartbeat Request (Version: 3) => group_id generation_id member_id group_instance_id
 *   group_id => STRING
 *   generation_id => INT32
 *   member_id => STRING
 *   group_instance_id => NULLABLE_STRING
 */

export default ({
  groupId,
  groupGenerationId,
  memberId,
  groupInstanceId,
}: any) => ({
  apiKey,
  apiVersion: 3,
  apiName: 'Heartbeat',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder()
      .writeString(groupId)
      .writeInt32(groupGenerationId)
      .writeString(memberId)
      .writeString(groupInstanceId);
  },
});
