// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { DescribeConfigs: apiKey } = require('../../apiKeys')

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
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  resources
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'DescribeConfigs',
  encode: async () => {
    return new Encoder().writeArray(resources.map(encodeResource))
  },
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeReso... Remove this comment to see the full error message
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
