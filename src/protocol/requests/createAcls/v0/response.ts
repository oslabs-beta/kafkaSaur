
import {Decoder} from '../../../decoder'

import { failure, createErrorFromCode } from '../../../error'

/**
 * CreateAcls Response (Version: 0) => throttle_time_ms [creation_responses]
 *   throttle_time_ms => INT32
 *   creation_responses => error_code error_message
 *     error_code => INT16
 *     error_message => NULLABLE_STRING
 */

const decodeCreationResponse = (decoder: any) => ({
  errorCode: decoder.readInt16(),
  errorMessage: decoder.readString()
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const throttleTime = decoder.readInt32()
  const creationResponses = decoder.readArray(decodeCreationResponse)

  return {
    throttleTime,
    creationResponses,
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parse'.
const parse = async (data: any) => {
  const creationResponsesWithError = data.creationResponses.filter(({
    errorCode
  }: any) =>
    failure(errorCode)
  )

  if (creationResponsesWithError.length > 0) {
    throw createErrorFromCode(creationResponsesWithError[0].errorCode)
  }

  return data
}

export {
  decode,
  parse,
}
