/** @format */

import response from '../v0/response.ts';
const { parse  } = response
//const { decode } = response 
const decodeV0 = response.decode

/**
 * Starting in version 1, on quota violation, brokers send out responses before throttling.
 * @see https://cwiki.apache.org/confluence/display/KAFKA/KIP-219+-+Improve+quota+communication
 *
 * CreateAcls Response (Version: 1) => throttle_time_ms [creation_responses]
 *   throttle_time_ms => INT32
 *   creation_responses => error_code error_message
 *     error_code => INT16
 *     error_message => NULLABLE_STRING
 */

const decode = async (rawData: any) => {
  const decoded = await decodeV0(rawData);

  return {
    ...decoded,
    throttleTime: 0,
    clientSideThrottleTime: decoded.throttleTime,
  };
};

export default { decode, parse };
