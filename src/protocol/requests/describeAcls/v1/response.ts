// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parse'.
const { parse } = require('../v0/response')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')

/**
 * Starting in version 1, on quota violation, brokers send out responses before throttling.
 * @see https://cwiki.apache.org/confluence/display/KAFKA/KIP-219+-+Improve+quota+communication
 * Version 1 also introduces a new resource pattern type field.
 * @see https://cwiki.apache.org/confluence/display/KAFKA/KIP-290%3A+Support+for+Prefixed+ACLs
 *
 * DescribeAcls Response (Version: 1) => throttle_time_ms error_code error_message [resources]
 *   throttle_time_ms => INT32
 *   error_code => INT16
 *   error_message => NULLABLE_STRING
 *   resources => resource_type resource_name resource_pattern_type [acls]
 *     resource_type => INT8
 *     resource_name => STRING
 *     resource_pattern_type => INT8
 *     acls => principal host operation permission_type
 *       principal => STRING
 *       host => STRING
 *       operation => INT8
 *       permission_type => INT8
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decodeAcls... Remove this comment to see the full error message
const decodeAcls = (decoder: any) => ({
  principal: decoder.readString(),
  host: decoder.readString(),
  operation: decoder.readInt8(),
  permissionType: decoder.readInt8()
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decodeReso... Remove this comment to see the full error message
const decodeResources = (decoder: any) => ({
  resourceType: decoder.readInt8(),
  resourceName: decoder.readString(),
  resourcePatternType: decoder.readInt8(),
  acls: decoder.readArray(decodeAcls)
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const throttleTime = decoder.readInt32()
  const errorCode = decoder.readInt16()
  const errorMessage = decoder.readString()
  const resources = decoder.readArray(decodeResources)

  return {
    throttleTime: 0,
    clientSideThrottleTime: throttleTime,
    errorCode,
    errorMessage,
    resources,
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export {
  decode,
  parse,
}
