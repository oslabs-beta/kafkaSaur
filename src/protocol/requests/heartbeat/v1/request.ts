/** @format */

import requestV0 from '../v0/request.ts';

/**
 * Heartbeat Request (Version: 1) => group_id generation_id member_id
 *   group_id => STRING
 *   generation_id => INT32
 *   member_id => STRING
 */

export default ({ groupId, groupGenerationId, memberId }: any) =>
  Object.assign(requestV0({ groupId, groupGenerationId, memberId }), {
    apiVersion: 1,
  });
