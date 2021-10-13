import requestV1 from '../v1/request.ts'

/**
 * FindCoordinator Request (Version: 2) => coordinator_key coordinator_type
 *   coordinator_key => STRING
 *   coordinator_type => INT8
 */

export default({
 coordinatorKey,
 coordinatorType
}: any) =>
  Object.assign(requestV1({ coordinatorKey, coordinatorType }), { apiVersion: 2 })
