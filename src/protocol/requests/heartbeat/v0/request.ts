/** @format */

// deno-lint-ignore-file no-explicit-any
import { Encoder } from '../../../encoder.ts';
import apiKeys from '../../apiKeys.ts';
const apiKey = apiKeys.Heartbeat;

/**
 * Heartbeat Request (Version: 0) => group_id group_generation_id member_id
 *   group_id => STRING
 *   group_generation_id => INT32
 *   member_id => STRING
 */

export default ({ groupId, groupGenerationId, memberId }: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'Heartbeat',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder()
      .writeString(groupId)
      .writeInt32(groupGenerationId)
      .writeString(memberId);
  },
});
