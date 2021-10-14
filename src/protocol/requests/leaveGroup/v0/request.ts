/** @format */

import { Encoder } from '../../../encoder.ts';
import apiKeys from '../../apiKeys.ts';

const apiKey = apiKeys.LeaveGroup;

/**
 * LeaveGroup Request (Version: 0) => group_id member_id
 *   group_id => STRING
 *   member_id => STRING
 */

export default ({ groupId, memberId }: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'LeaveGroup',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder().writeString(groupId).writeString(memberId);
  },
});
