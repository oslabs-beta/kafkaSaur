import {Decoder} from '../../../decoder.ts';

import { failure, createErrorFromCode } from '../../../error.ts'
import ConfigSource from '../../../configSource.ts'
import ConfigResourceTypes from '../../../configResourceTypes.ts'

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
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const throttleTime = decoder.readInt32()
  const resources = decoder.readArray(decodeResources)

  return {
    throttleTime,
    resources,
  }
}
//deno-lint-ignore require-await
const parse = async (data: any) => {
  const resourcesWithError = data.resources.filter(({
    errorCode
  }: any) => failure(errorCode))
  if (resourcesWithError.length > 0) {
    throw createErrorFromCode(resourcesWithError[0].errorCode)
  }

  return data
}

export default {
  decode,
  parse,
}
