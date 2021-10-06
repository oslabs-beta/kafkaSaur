/** @format */

import { Encoder } from '../../../encoder.ts';

import apiKeys from '../../apiKeys.ts';

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

const apiKey = apiKeys.CreateAcls;

const encodeCreations = ({
  resourceType,
  resourceName,
  resourcePatternType,
  principal,
  host,
  operation,
  permissionType,
}: any) => {
  return new Encoder()
    .writeInt8(resourceType)
    .writeString(resourceName)
    .writeInt8(resourcePatternType)
    .writeString(principal)
    .writeString(host)
    .writeInt8(operation)
    .writeInt8(permissionType);
};

export default ({ creations }: any) => ({
  apiKey,
  apiVersion: 1,
  apiName: 'CreateAcls',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder().writeArray(creations.map(encodeCreations));
  },
});
