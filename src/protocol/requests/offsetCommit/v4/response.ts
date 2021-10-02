/** @format */

import response from '../v3/response.ts';
const parse = response.parse;
const decodeV3 = response.decode;
/**
 * Starting in version 4, on quota violation, brokers send out responses before throttling.
 * @see https://cwiki.apache.org/confluence/display/KAFKA/KIP-219+-+Improve+quota+communication
 *
 * OffsetCommit Response (Version: 4) => throttle_time_ms [responses]
 *   throttle_time_ms => INT32
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition error_code
 *       partition => INT32
 *       error_code => INT16
 */

const decode = async (rawData: any) => {
  const decoded = await decodeV3(rawData);

  return {
    ...decoded,
    throttleTime: 0,
    clientSideThrottleTime: decoded.throttleTime,
  };
};

export default { decode, parse };
