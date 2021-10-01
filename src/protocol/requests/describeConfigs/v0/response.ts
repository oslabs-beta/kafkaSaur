// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'failure'.
const { failure, createErrorFromCode } = require('../../../error')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ConfigSour... Remove this comment to see the full error message
const ConfigSource = require('../../../configSource')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ConfigReso... Remove this comment to see the full error message
const ConfigResourceTypes = require('../../../configResourceTypes')

/**
 * DescribeConfigs Response (Version: 0) => throttle_time_ms [resources]
 *   throttle_time_ms => INT32
 *   resources => error_code error_message resource_type resource_name [config_entries]
 *     error_code => INT16
 *     error_message => NULLABLE_STRING
 *     resource_type => INT8
 *     resource_name => STRING
 *     config_entries => config_name config_value read_only is_default is_sensitive
 *       config_name => STRING
 *       config_value => NULLABLE_STRING
 *       read_only => BOOLEAN
 *       is_default => BOOLEAN
 *       is_sensitive => BOOLEAN
 */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decodeConf... Remove this comment to see the full error message
const decodeConfigEntries = (decoder: any, resourceType: any) => {
  const configName = decoder.readString()
  const configValue = decoder.readString()
  const readOnly = decoder.readBoolean()
  const isDefault = decoder.readBoolean()
  const isSensitive = decoder.readBoolean()

  /**
   * Backporting ConfigSource value to v0
   * @see https://github.com/apache/kafka/blob/trunk/clients/src/main/java/org/apache/kafka/common/requests/DescribeConfigsResponse.java#L232-L242
   */
  let configSource
  if (isDefault) {
    configSource = ConfigSource.DEFAULT_CONFIG
  } else {
    switch (resourceType) {
      case ConfigResourceTypes.BROKER:
        configSource = ConfigSource.STATIC_BROKER_CONFIG
        break
      case ConfigResourceTypes.TOPIC:
        configSource = ConfigSource.TOPIC_CONFIG
        break
      default:
        configSource = ConfigSource.UNKNOWN
    }
  }

  return {
    configName,
    configValue,
    readOnly,
    isDefault,
    configSource,
    isSensitive,
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decodeReso... Remove this comment to see the full error message
const decodeResources = (decoder: any) => {
  const errorCode = decoder.readInt16()
  const errorMessage = decoder.readString()
  const resourceType = decoder.readInt8()
  const resourceName = decoder.readString()
  const configEntries = decoder.readArray((decoder: any) => decodeConfigEntries(decoder, resourceType))

  return {
    errorCode,
    errorMessage,
    resourceType,
    resourceName,
    configEntries,
  }
}

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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parse'.
const parse = async (data: any) => {
  const resourcesWithError = data.resources.filter(({
    errorCode
  }: any) => failure(errorCode))
  if (resourcesWithError.length > 0) {
    throw createErrorFromCode(resourcesWithError[0].errorCode)
  }

  return data
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export {
  decode,
  parse,
}
