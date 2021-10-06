/** @format */

import { Buffer } from 'https://deno.land/std@0.110.0/node/buffer.ts';

import { Encoder } from '../../../encoder.ts';
import apiKeys from '../../apiKeys.ts';
const apiKey = apiKeys.JoinGroup;
/**
 * Version 5 adds group_instance_id to identify members across restarts.
 * @see https://cwiki.apache.org/confluence/display/KAFKA/KIP-345%3A+Introduce+static+membership+protocol+to+reduce+consumer+rebalances
 *
 * JoinGroup Request (Version: 5) => group_id session_timeout rebalance_timeout member_id group_instance_id protocol_type [group_protocols]
 *   group_id => STRING
 *   session_timeout => INT32
 *   rebalance_timeout => INT32
 *   member_id => STRING
 *   group_instance_id => NULLABLE_STRING
 *   protocol_type => STRING
 *   group_protocols => protocol_name protocol_metadata
 *     protocol_name => STRING
 *     protocol_metadata => BYTES
 */

export default ({
  groupId,
  sessionTimeout,
  rebalanceTimeout,
  memberId,
  groupInstanceId = null,
  protocolType,
  groupProtocols,
}: any) => ({
  apiKey,
  apiVersion: 5,
  apiName: 'JoinGroup',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder()
      .writeString(groupId)
      .writeInt32(sessionTimeout)
      .writeInt32(rebalanceTimeout)
      .writeString(memberId)
      .writeString(groupInstanceId)
      .writeString(protocolType)
      .writeArray(groupProtocols.map(encodeGroupProtocols));
  },
});

const encodeGroupProtocols = ({ name, metadata = Buffer.alloc(0) }: any) => {
  return new Encoder().writeString(name).writeBytes(metadata);
};
