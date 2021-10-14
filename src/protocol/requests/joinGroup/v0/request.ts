/** @format */
import { Buffer } from 'https://deno.land/std@0.110.0/node/buffer.ts';
import { Encoder } from '../../../encoder.ts';
import apiKeys from '../../apiKeys.ts';
const apiKey = apiKeys.JoinGroup;
/**
 * JoinGroup Request (Version: 0) => group_id session_timeout member_id protocol_type [group_protocols]
 *   group_id => STRING
 *   session_timeout => INT32
 *   member_id => STRING
 *   protocol_type => STRING
 *   group_protocols => protocol_name protocol_metadata
 *     protocol_name => STRING
 *     protocol_metadata => BYTES
 */

export default ({
  groupId,
  sessionTimeout,
  memberId,
  protocolType,
  groupProtocols,
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'JoinGroup',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder()
      .writeString(groupId)
      .writeInt32(sessionTimeout)
      .writeString(memberId)
      .writeString(protocolType)
      .writeArray(groupProtocols.map(encodeGroupProtocols));
  },
});

const encodeGroupProtocols = ({ name, metadata = Buffer.alloc(0) }: any) => {
  return new Encoder().writeString(name).writeBytes(metadata);
};
