// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseV0'.
const { parse: parseV0 } = require('../v0/response')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DEFAULT_CO... Remove this comment to see the full error message
const { DEFAULT_CONFIG } = require('../../../configSource')

/**
 * DescribeConfigs Response (Version: 1) => throttle_time_ms [resources]
 *   throttle_time_ms => INT32
 *   resources => error_code error_message resource_type resource_name [config_entries]
 *     error_code => INT16
 *     error_message => NULLABLE_STRING
 *     resource_type => INT8
 *     resource_name => STRING
 *     config_entries => config_name config_value read_only config_source is_sensitive [config_synonyms]
 *       config_name => STRING
 *       config_value => NULLABLE_STRING
 *       read_only => BOOLEAN
 *       config_source => INT8
 *       is_sensitive => BOOLEAN
 *       config_synonyms => config_name config_value config_source
 *         config_name => STRING
 *         config_value => NULLABLE_STRING
 *         config_source => INT8
 */

const decodeSynonyms = (decoder: any) => ({
  configName: decoder.readString(),
  configValue: decoder.readString(),
  configSource: decoder.readInt8()
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decodeConf... Remove this comment to see the full error message
const decodeConfigEntries = (decoder: any) => {
  const configName = decoder.readString()
  const configValue = decoder.readString()
  const readOnly = decoder.readBoolean()
  const configSource = decoder.readInt8()
  const isSensitive = decoder.readBoolean()
  const configSynonyms = decoder.readArray(decodeSynonyms)

  return {
    configName,
    configValue,
    readOnly,
    isDefault: configSource === DEFAULT_CONFIG,
    configSource,
    isSensitive,
    configSynonyms,
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decodeReso... Remove this comment to see the full error message
const decodeResources = (decoder: any) => ({
  errorCode: decoder.readInt16(),
  errorMessage: decoder.readString(),
  resourceType: decoder.readInt8(),
  resourceName: decoder.readString(),
  configEntries: decoder.readArray(decodeConfigEntries)
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const throttleTime = decoder.readInt32()
  const resources = decoder.readArray(decodeResources)

  return {
    throttleTime,
    resources,
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export {
  decode,
  parse: parseV0,
}
