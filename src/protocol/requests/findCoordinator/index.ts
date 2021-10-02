import COORDINATOR_TYPES from '../../coordinatorTypes.ts'
import requestV0 from './v0/request.ts'
import responseV0 from './v0/response.ts'
import requestV1 from './v1/request.ts'
import responseV1 from './v1/response.ts'
import requestV2 from './v2/request.ts'
import responseV2 from './v2/response.ts'

const versions : Record<number, any> = {
  0: ({
    groupId
  }: any) => {
    const request = requestV0
    const response = responseV0
    return { request: request({ groupId }), response }
  },
  1: ({
    groupId,
    coordinatorType = COORDINATOR_TYPES.GROUP
  }: any) => {
    const request = requestV1
    const response = responseV1
    return { request: request({ coordinatorKey: groupId, coordinatorType }), response }
  },
  2: ({
    groupId,
    coordinatorType = COORDINATOR_TYPES.GROUP
  }: any) => {
    const request = requestV2
    const response = responseV2
    return { request: request({ coordinatorKey: groupId, coordinatorType }), response }
  },
}

export default {
  versions: Object.keys(versions),
  protocol: ({
    version
  }: any) => versions[version],
}
