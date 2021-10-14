
import requestV1 from "./v1/request.ts"
import responseV1 from "./v1/response.ts"
import requestV2 from "./v2/request.ts"
import responseV2 from "./v2/response.ts"
import requestV3 from "./v3/request.ts"
import responseV3 from "./v3/response.ts"
import requestV4 from "./v4/request.ts"
import responseV4 from "./v4/response.ts"


const versions: Record <number, any> = {
  1: ({
    groupId,
    topics
  }: any) => {
    const request = requestV1
    const response = responseV1
    return { request: request({ groupId, topics }), response }
  },
  2: ({
    groupId,
    topics
  }: any) => {
    const request = requestV2
    const response = responseV2
    return { request: request({ groupId, topics }), response }
  },
  3: ({
    groupId,
    topics
  }: any) => {
    const request = requestV3
    const response = responseV3
    return { request: request({ groupId, topics }), response }
  },
  4: ({
    groupId,
    topics
  }: any) => {
    const request = requestV4
    const response = responseV4
    return { request: request({ groupId, topics }), response }
  },
}

export default {
  versions: Object.keys(versions),
  protocol: ({
    version
  }: any) => versions[version],
}
