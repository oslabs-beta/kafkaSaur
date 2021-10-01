/** @format */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
import Encoder from '../../../encoder.ts';
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
import { AlterConfigs as apiKey } from '../../apiKeys.ts';

/**
 * AlterConfigs Request (Version: 0) => [resources] validate_only
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
export default ({ resources, validateOnly = false }: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'AlterConfigs',
  encode: async () => {
    return new Encoder()
      .writeArray(resources.map(encodeResource))
      .writeBoolean(validateOnly);
  },
});

const encodeResource = ({ type, name, configEntries }: any) => {
  return new Encoder()
    .writeInt8(type)
    .writeString(name)
    .writeArray(configEntries.map(encodeConfigEntries));
};

const encodeConfigEntries = ({ name, value }: any) => {
  return new Encoder().writeString(name).writeString(value);
};
