import {Encoder} from '../../../encoder.ts' 
import apiKeys from '../../apiKeys.ts'


/**
 * DeleteAcls Request (Version: 0) => [filters]
 *   filters => resource_type resource_name principal host operation permission_type
 *     resource_type => INT8
 *     resource_name => NULLABLE_STRING
 *     principal => NULLABLE_STRING
 *     host => NULLABLE_STRING
 *     operation => INT8
 *     permission_type => INT8
 */

const apiKey = apiKeys.DeleteAcls
const encodeFilters = ({
  resourceType,
  resourceName,
  principal,
  host,
  operation,
  permissionType
}: any) => {
  return new Encoder()
    .writeInt8(resourceType)
    .writeString(resourceName)
    .writeString(principal)
    .writeString(host)
    .writeInt8(operation)
    .writeInt8(permissionType)
}

export default ({
  filters
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'DeleteAcls',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder().writeArray(filters.map(encodeFilters))
  },
})
