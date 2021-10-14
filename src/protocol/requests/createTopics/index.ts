
import requestV0 from './v0/request.ts'
import responseV0 from './v0/response.ts'

import requestV1 from './v1/request.ts'
import responseV1 from './v1/response.ts'

import requestV2 from './v2/request.ts'
import responseV2 from './v2/response.ts'

import requestV3 from './v3/request.ts'
import responseV3 from './v3/response.ts'



const versions: any = {
  0: ({
    topics,
    timeout
  }: any) => {
    const request = requestV0
    const response =responseV0 
    return { request: request({ topics, timeout }), response }
  },
  1: ({
    topics,
    validateOnly,
    timeout
  }: any) => {
    const request = requestV1
    const response =responseV1 
    return { request: request({ topics, validateOnly, timeout }), response }
  },
  2: ({
    topics,
    validateOnly,
    timeout
  }: any) => {
    const request = requestV2
    const response =responseV2 
    return { request: request({ topics, validateOnly, timeout }), response }
  },
  3: ({
    topics,
    validateOnly,
    timeout
  }: any) => {
    const request = requestV3
    const response =responseV3 
    return { request: request({ topics, validateOnly, timeout }), response }
  },
}

export default {
  versions: Object.keys(versions),
  protocol: ({
    version
  }: any) => versions[version],
}
