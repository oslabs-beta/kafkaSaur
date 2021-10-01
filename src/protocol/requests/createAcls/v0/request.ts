
import {Encoder} from '../../../encoder'

import { CreateAcls as apiKey } from '../../apiKeys'
//steph
/**
 * CreateAcls Request (Version: 0) => [creations]
 *   creations => resource_type resource_name principal host operation permission_type
 *     resource_type => INT8
 *     resource_name => STRING
 *     principal => STRING
 *     host => STRING
 *     operation => INT8
 *     permission_type => INT8
 */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeCrea... Remove this comment to see the full error message
const encodeCreations = ({
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
export ({
  creations
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'CreateAcls',
  encode: async () => {
    return new Encoder().writeArray(creations.map(encodeCreations))
  },
})
