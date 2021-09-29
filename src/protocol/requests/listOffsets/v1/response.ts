// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'failure'.
const { failure, createErrorFromCode } = require('../../../error')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'flatten'.
const flatten = require('../../../../utils/flatten')

/**
 * ListOffsets Response (Version: 1) => [responses]
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition error_code timestamp offset
 *       partition => INT32
 *       error_code => INT16
 *       timestamp => INT64
 *       offset => INT64
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)

  return {
    responses: decoder.readArray(decodeResponses),
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decodeResp... Remove this comment to see the full error message
const decodeResponses = (decoder: any) => ({
  topic: decoder.readString(),
  partitions: decoder.readArray(decodePartitions)
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decodePart... Remove this comment to see the full error message
const decodePartitions = (decoder: any) => ({
  partition: decoder.readInt32(),
  errorCode: decoder.readInt16(),
  timestamp: decoder.readInt64().toString(),
  offset: decoder.readInt64().toString()
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parse'.
const parse = async (data: any) => {
  const partitionsWithError = data.responses.map((response: any) => response.partitions.filter((partition: any) => failure(partition.errorCode))
  )
  const partitionWithError = flatten(partitionsWithError)[0]
  if (partitionWithError) {
    throw createErrorFromCode(partitionWithError.errorCode)
  }

  return data
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export {
  decode,
  parse,
}
