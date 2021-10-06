/** @format */

import { Encoder } from '../../../encoder.ts';
import apiKeys from '../../apiKeys.ts';
const apiKey = apiKeys.LeaveGroup;
/**
 * Version 3 changes leavegroup to operate on a batch of members
 * and adds group_instance_id to identify members across restarts.
 * @see https://cwiki.apache.org/confluence/display/KAFKA/KIP-345%3A+Introduce+static+membership+protocol+to+reduce+consumer+rebalances
 *
 * LeaveGroup Request (Version: 3) => group_id [members]
 *   group_id => STRING
 *   members => member_id group_instance_id
 *     member_id => STRING
 *     group_instance_id => NULLABLE_STRING
 */

export default ({ groupId, members }: any) => ({
  apiKey,
  apiVersion: 3,
  apiName: 'LeaveGroup',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder()
      .writeString(groupId)
      .writeArray(members.map((member: any) => encodeMember(member)));
  },
});

const encodeMember = ({ memberId, groupInstanceId = null }: any) => {
  return new Encoder().writeString(memberId).writeString(groupInstanceId);
};
