/** @format */

import requestV1 from '../v1/request.ts';

/**
 * LeaveGroup Request (Version: 2) => group_id member_id
 *   group_id => STRING
 *   member_id => STRING
 */

export default ({ groupId, memberId }: any) =>
  Object.assign(requestV1({ groupId, memberId }), { apiVersion: 2 });
