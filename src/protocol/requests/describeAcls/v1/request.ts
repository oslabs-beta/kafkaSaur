// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { DescribeAcls: apiKey } = require('../../apiKeys')

/**
 * DescribeAcls Request (Version: 1) => resource_type resource_name resource_pattern_type_filter principal host operation permission_type
 *   resource_type => INT8
 *   resource_name => NULLABLE_STRING
 *   resource_pattern_type_filter => INT8
 *   principal => NULLABLE_STRING
 *   host => NULLABLE_STRING
 *   operation => INT8
 *   permission_type => INT8
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  resourceType,
  resourceName,
  resourcePatternType,
  principal,
  host,
  operation,
  permissionType
}: any) => ({
  apiKey,
  apiVersion: 1,
  apiName: 'DescribeAcls',
  encode: async () => {
    return new Encoder()
      .writeInt8(resourceType)
      .writeString(resourceName)
      .writeInt8(resourcePatternType)
      .writeString(principal)
      .writeString(host)
      .writeInt8(operation)
      .writeInt8(permissionType)
  },
})
