import { Decoder } from '../../../decoder.ts'
import { failure, createErrorFromCode, failIfVersionNotSupported } from '../../../error.ts'

/**
 * SyncGroup Response (Version: 0) => error_code member_assignment
 *   error_code => INT16
 *   member_assignment => BYTES
 */

const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const errorCode = decoder.readInt16()

  failIfVersionNotSupported(errorCode)

  return {
    errorCode,
    memberAssignment: decoder.readBytes(),
  }
}

const parse = async (data: any) => {
  if (failure(data.errorCode)) {
    throw createErrorFromCode(data.errorCode)
  }

  return data
}

export default {
  decode,
  parse,
}
