/** @format */
import requestV0 from './v0/request.ts'
import responseV0 from './v0/response.ts'

import requestV1 from './v1/request.ts'
import responseV1 from './v1/response.ts'

import requestV2 from './v2/request.ts'
import responseV2 from './v2/response.ts'

const logResponseError = false;


const versions: any = {
  0: () => {
    const request = requestV0
    const response = responseV0
    return { request: request(), response, logResponseError: true };
  },
  1: () => {
    const request = requestV1
    const response = responseV1
    return { request: request(), response, logResponseError };
  },
  2: () => {
    const request = requestV2
    const response = responseV2
    return { request: request(), response, logResponseError };
  },
};

export default {
  versions: Object.keys(versions),
  protocol: ({
    version,
  }: 
  any) => versions[version],
};
