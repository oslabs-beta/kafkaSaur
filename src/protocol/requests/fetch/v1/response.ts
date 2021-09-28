// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseV0'.
const { parse: parseV0 } = require('../v0/response')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MessageSet... Remove this comment to see the full error message
const MessageSetDecoder = require('../../../messageSet/decoder')

/**
 * Fetch Response (Version: 1) => throttle_time_ms [responses]
 *   throttle_time_ms => INT32
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition_header record_set
 *       partition_header => partition error_code high_watermark
 *         partition => INT32
 *         error_code => INT16
 *         high_watermark => INT64
 *       record_set => RECORDS
 */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decodePart... Remove this comment to see the full error message
const decodePartition = async (decoder: any) => ({
  partition: decoder.readInt32(),
  errorCode: decoder.readInt16(),
  highWatermark: decoder.readInt64().toString(),
  messages: await MessageSetDecoder(decoder)
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decodeResp... Remove this comment to see the full error message
const decodeResponse = async (decoder: any) => ({
  topicName: decoder.readString(),
  partitions: await decoder.readArrayAsync(decodePartition)
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const throttleTime = decoder.readInt32()
  const responses = await decoder.readArrayAsync(decodeResponse)

  return {
    throttleTime,
    responses,
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  decode,
  parse: parseV0,
}
