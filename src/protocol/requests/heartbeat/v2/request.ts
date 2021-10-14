/** @format */

import requestV1 from '../v1/request.ts';

/**
 * Heartbeat Request (Version: 2) => group_id generation_id member_id
 *   group_id => STRING
 *   generation_id => INT32
 *   member_id => STRING
 */

export default ({ groupId, groupGenerationId, memberId }: any) =>
  Object.assign(requestV1({ groupId, groupGenerationId, memberId }), {
    apiVersion: 2,
  });
