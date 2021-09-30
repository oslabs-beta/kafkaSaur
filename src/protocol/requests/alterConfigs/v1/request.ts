// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestV0'... Remove this comment to see the full error message
import requestV0 from '../v0/request'

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
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  resources,
  validateOnly
}: any) =>
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  Object.assign(
    requestV0({
      resources,
      validateOnly,
    }),
    { apiVersion: 1 }
  )
