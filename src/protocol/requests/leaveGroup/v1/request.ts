/** @format */

import requestV0 from '../v0/request.ts';

/**
 * LeaveGroup Request (Version: 1) => group_id member_id
 *   group_id => STRING
 *   member_id => STRING
 */

export default ({ groupId, memberId }: any) =>
  Object.assign(requestV0({ groupId, memberId }), { apiVersion: 1 });
