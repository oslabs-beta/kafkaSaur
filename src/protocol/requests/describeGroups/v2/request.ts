import requestV1 from '../v1/request.ts'

/**
 * DescribeGroups Request (Version: 2) => [group_ids]
 *   group_ids => STRING
 */

export default({
 groupIds
}: any) => Object.assign(requestV1({ groupIds }), { apiVersion: 2 })
