
import requestV0 from '../v0/request.ts'

/**
 * DeleteGroups Request (Version: 1)
 */

export default (groupIds: any) => Object.assign(requestV0(groupIds), { apiVersion: 1 })
