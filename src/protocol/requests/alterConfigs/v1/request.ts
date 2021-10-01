/** @format */

import requestV0 from '../v0/request.ts';

/**
 * AlterConfigs Request (Version: 1) => [resources] validate_only
 *   resources => resource_type resource_name [config_entries]
 *     resource_type => INT8
 *     resource_name => STRING
 *     config_entries => config_name config_value
 *       config_name => STRING
 *       config_value => NULLABLE_STRING
 *   validate_only => BOOLEAN
 */

/**
 * @param {Array} resources An array of resources to change
 * @param {boolean} [validateOnly=false]
 */
export default ({ resources, validateOnly }: any) =>
  Object.assign(
    requestV0({
      resources,
      validateOnly,
    }),
    { apiVersion: 1 }
  );
