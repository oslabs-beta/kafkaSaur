import requestV1 from '../v1/request.ts'

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
 includeSynonyms
}: any) =>
  Object.assign(requestV1({ resources, includeSynonyms }), { apiVersion: 2 })
