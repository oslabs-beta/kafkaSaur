// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { DeleteAcls: apiKey } = require('../../apiKeys')

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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeFilt... Remove this comment to see the full error message
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

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
  filters
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'DeleteAcls',
  encode: async () => {
    return new Encoder().writeArray(filters.map(encodeFilters))
  },
})
