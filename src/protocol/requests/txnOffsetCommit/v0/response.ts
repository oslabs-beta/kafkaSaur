// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'failure'.
const { failure, createErrorFromCode } = require('../../../error')

/**
 * TxnOffsetCommit Response (Version: 0) => throttle_time_ms [topics]
 *   throttle_time_ms => INT32
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition error_code
 *       partition => INT32
 *       error_code => INT16
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const throttleTime = decoder.readInt32()
  const topics = await decoder.readArrayAsync(decodeTopic)

  return {
    throttleTime,
    topics,
  }
}

const decodeTopic = async (decoder: any) => ({
  topic: decoder.readString(),
  partitions: await decoder.readArrayAsync(decodePartition)
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decodePart... Remove this comment to see the full error message
const decodePartition = (decoder: any) => ({
  partition: decoder.readInt32(),
  errorCode: decoder.readInt16()
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parse'.
const parse = async (data: any) => {
  const topicsWithErrors = data.topics
    .map(({
    partitions
  }: any) => ({
      partitionsWithErrors: partitions.filter(({
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
module.exports = {
  decode,
  parse,
}
