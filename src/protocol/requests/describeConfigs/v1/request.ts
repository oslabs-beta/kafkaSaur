import {Encoder} from '../../../encoder.ts'
import apiKeys from '../../apiKeys.ts'

const apiKey = apiKeys.DescribeConfigs
/**
 * DescribeConfigs Request (Version: 1) => [resources] include_synonyms
 *   resources => resource_type resource_name [config_names]
 *     resource_type => INT8
 *     resource_name => STRING
 *     config_names => STRING
 *   include_synonyms => BOOLEAN
 */

/**
 * @param {Array} resources An array of config resources to be returned
 * @param [includeSynonyms=false]
 */
export default ({
  resources,
  includeSynonyms = false
}: any) => ({
  apiKey,
  apiVersion: 1,
  apiName: 'DescribeConfigs',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder().writeArray(resources.map(encodeResource)).writeBoolean(includeSynonyms)
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
