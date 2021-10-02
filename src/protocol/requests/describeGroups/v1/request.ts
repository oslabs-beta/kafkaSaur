import requestV0 from '../v0/request.ts'

/**
 * DescribeGroups Request (Version: 1) => [group_ids]
 *   group_ids => STRING
 */

export default ({
 groupIds
}: any) => Object.assign(requestV0({ groupIds }), { apiVersion: 1 })
