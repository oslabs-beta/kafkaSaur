// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
import Decoder from '../../../decoder'

import { failure, createErrorFromCode } from '../../../error'

/**
 * AddPartitionsToTxn Response (Version: 0) => throttle_time_ms [errors]
 *   throttle_time_ms => INT32
 *   errors => topic [partition_errors]
 *     topic => STRING
 *     partition_errors => partition error_code
 *       partition => INT32
 *       error_code => INT16
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const throttleTime = decoder.readInt32()
  const errors = await decoder.readArrayAsync(decodeError)

  return {
    throttleTime,
    errors,
  }
}

const decodeError = async (decoder: any) => ({
  topic: decoder.readString(),
  partitionErrors: await decoder.readArrayAsync(decodePartitionError)
})

const decodePartitionError = (decoder: any) => ({
  partition: decoder.readInt32(),
  errorCode: decoder.readInt16()
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parse'.
const parse = async (data: any) => {
  const topicsWithErrors = data.errors
    .map(({
    partitionErrors
  }: any) => ({
      partitionsWithErrors: partitionErrors.filter(({
        errorCode
      }: any) => failure(errorCode)),
    }))
    .filter(({
    partitionsWithErrors
  }: any) => partitionsWithErrors.length)

  if (topicsWithErrors.length > 0) {
    throw createErrorFromCode(topicsWithErrors[0].partitionsWithErrors[0].errorCode)
  }

  return data
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export {
  decode,
  parse,
}
