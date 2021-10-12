import requestV0 from './v0/request.ts'
import responseV0 from './v0/response.ts'
import requestV1 from './v1/request.ts'
import responseV1 from './v1/response.ts'
import requestV2 from './v2/request.ts'
import responseV2 from './v2/response.ts'
import requestV3 from './v3/request.ts'
import responseV3 from './v3/response.ts'




const versions: Record<number, any> = {
  0: ({
    groupId,
    generationId,
    memberId,
    groupAssignment
  }: any) => {
    const request = requestV0
    const response = responseV0
    return {
      request: request({ groupId, generationId, memberId, groupAssignment }),
      response,
    }
  },
  1: ({
    groupId,
    generationId,
    memberId,
    groupAssignment
  }: any) => {
    const request = requestV1
    const response = responseV1
    return {
      request: request({ groupId, generationId, memberId, groupAssignment }),
      response,
    }
  },
  2: ({
    groupId,
    generationId,
    memberId,
    groupAssignment
  }: any) => {
    const request = requestV2
    const response = responseV2
    return {
      request: request({ groupId, generationId, memberId, groupAssignment }),
      response,
    }
  },
  3: ({
    groupId,
    generationId,
    memberId,
    groupInstanceId,
    groupAssignment
  }: any) => {
    const request = requestV3
    const response = responseV3
    return {
      request: request({ groupId, generationId, memberId, groupInstanceId, groupAssignment }),
      response,
    }
  },
}

export default {
  versions: Object.keys(versions),
  protocol: ({ version }: any) => versions[version],
}
