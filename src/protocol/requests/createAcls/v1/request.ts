// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { CreateAcls: apiKey } = require('../../apiKeys')

/**
 * CreateAcls Request (Version: 1) => [creations]
 *   creations => resource_type resource_name resource_pattern_type principal host operation permission_type
 *     resource_type => INT8
 *     resource_name => STRING
 *     resource_pattern_type => INT8
 *     principal => STRING
 *     host => STRING
 *     operation => INT8
 *     permission_type => INT8
 */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeCrea... Remove this comment to see the full error message
const encodeCreations = ({
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

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
  creations
}: any) => ({
  apiKey,
  apiVersion: 1,
  apiName: 'CreateAcls',
  encode: async () => {
    return new Encoder().writeArray(creations.map(encodeCreations))
  },
})
