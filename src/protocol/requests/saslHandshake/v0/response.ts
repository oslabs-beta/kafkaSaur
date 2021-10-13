import { Decoder } from '../../../decoder.ts'
import { failure, createErrorFromCode, failIfVersionNotSupported } from '../../../error.ts'

/**
 * SaslHandshake Response (Version: 0) => error_code [enabled_mechanisms]
 *    error_code => INT16
 *    enabled_mechanisms => STRING
 */
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const errorCode = decoder.readInt16()

  failIfVersionNotSupported(errorCode)

  return {
    errorCode,
    enabledMechanisms: decoder.readArray((decoder: Decoder) => decoder.readString()),
  };
}
//deno-lint-ignore require-await
const parse = async (data: any) => {
  if (failure(data.errorCode)) {
    throw createErrorFromCode(data.errorCode)
  }

  return data
}

export {
  decode,
  parse,
}
