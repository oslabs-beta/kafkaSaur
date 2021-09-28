// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestV1'... Remove this comment to see the full error message
const requestV1 = require('../v1/request')

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
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
 resources,
 includeSynonyms
}: any) =>
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  Object.assign(requestV1({ resources, includeSynonyms }), { apiVersion: 2 })
