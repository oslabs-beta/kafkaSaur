/** @format */

import requestV1 from '../v1/request.ts';

/**
 * JoinGroup Request (Version: 2) => group_id session_timeout rebalance_timeout member_id protocol_type [group_protocols]
 *   group_id => STRING
 *   session_timeout => INT32
 *   rebalance_timeout => INT32
 *   member_id => STRING
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
  protocolType,
  groupProtocols,
}: any) =>
  Object.assign(
    requestV1({
      groupId,
      sessionTimeout,
      rebalanceTimeout,
      memberId,
      protocolType,
      groupProtocols,
    }),
    { apiVersion: 2 }
  );
