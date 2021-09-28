// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'failure'.
const { failure, createErrorFromCode } = require('../../../error')
/**
 * DeleteGroups Response (Version: 0) => throttle_time_ms [results]
 *  throttle_time_ms => INT32
 *  results => group_id error_code
 *    group_id => STRING
 *    error_code => INT16
 */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decodeGrou... Remove this comment to see the full error message
const decodeGroup = (decoder: any) => ({
  groupId: decoder.readString(),
  errorCode: decoder.readInt16()
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const throttleTimeMs = decoder.readInt32()
  const results = decoder.readArray(decodeGroup)

  for (const result of results) {
    if (failure(result.errorCode)) {
      result.error = createErrorFromCode(result.errorCode)
    }
  }
  return {
    throttleTimeMs,
    results,
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parse'.
const parse = async (data: any) => {
  return data
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  decode,
  parse,
}
