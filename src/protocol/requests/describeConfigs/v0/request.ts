import {Encoder} from '../../../encoder.ts'
import apiKeys from '../../apiKeys.ts'

const apiKey = apiKeys.DescribeConfigs
/**
 * DescribeConfigs Request (Version: 0) => [resources]
 *   resources => resource_type resource_name [config_names]
 *     resource_type => INT8
 *     resource_name => STRING
 *     config_names => STRING
 */

/**
 * @param {Array} resources An array of config resources to be returned
 */
export default({
  resources
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'DescribeConfigs',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder().writeArray(resources.map(encodeResource))
  },
})

const encodeResource = ({
  type,
  name,
  configNames = []
}: any) => {
  return new Encoder()
    .writeInt8(type)
    .writeString(name)
    .writeNullableArray(configNames)
}
