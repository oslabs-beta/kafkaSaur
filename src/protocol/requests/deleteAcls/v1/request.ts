import { Encoder } from '../../../encoder.ts'
import apiKeys from '../../apiKeys.ts'
const apiKey = apiKeys.DeleteAcls

/**
 * DeleteAcls Request (Version: 1) => [filters]
 *   filters => resource_type resource_name resource_pattern_type_filter principal host operation permission_type
 *     resource_type => INT8
 *     resource_name => NULLABLE_STRING
 *     resource_pattern_type_filter => INT8
 *     principal => NULLABLE_STRING
 *     host => NULLABLE_STRING
 *     operation => INT8
 *     permission_type => INT8
 */

const encodeFilters = ({
  resourceType,
  resourceName,
  resourcePatternType,
  principal,
  host,
  operation,
  permissionType
}: any) => {
  return new Encoder()
    .writeInt8(resourceType)
    .writeString(resourceName)
    .writeInt8(resourcePatternType)
    .writeString(principal)
    .writeString(host)
    .writeInt8(operation)
    .writeInt8(permissionType)
}

export default ({
  filters
}: any) => ({
  apiKey,
  apiVersion: 1,
  apiName: 'DeleteAcls',
  // deno-lint-ignore require-await 
  encode: async () => {
    return new Encoder().writeArray(filters.map(encodeFilters))
  },
})
