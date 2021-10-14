import {Encoder} from '../../../encoder.ts'
import apiKeys from '../../apiKeys.ts'

const apiKey = apiKeys.DescribeAcls
/**
 * DescribeAcls Request (Version: 0) => resource_type resource_name principal host operation permission_type
 *   resource_type => INT8
 *   resource_name => NULLABLE_STRING
 *   principal => NULLABLE_STRING
 *   host => NULLABLE_STRING
 *   operation => INT8
 *   permission_type => INT8
 */

export default ({
  resourceType,
  resourceName,
  principal,
  host,
  operation,
  permissionType
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'DescribeAcls',
  encode: async () => {
    return new Encoder()
      .writeInt8(resourceType)
      .writeString(resourceName)
      .writeString(principal)
      .writeString(host)
      .writeInt8(operation)
      .writeInt8(permissionType)
  },
})
