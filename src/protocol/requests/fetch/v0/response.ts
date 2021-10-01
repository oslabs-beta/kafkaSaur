// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSOff... Remove this comment to see the full error message
const { KafkaJSOffsetOutOfRange } = require('../../../../errors')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'failure'.
const { failure, createErrorFromCode, errorCodes } = require('../../../error')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'flatten'.
const flatten = require('../../../../utils/flatten')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MessageSet... Remove this comment to see the full error message
const MessageSetDecoder = require('../../../messageSet/decoder')

/**
 * Fetch Response (Version: 0) => [responses]
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
  const responses = await decoder.readArrayAsync(decodeResponse)

  return {
    responses,
  }
}

const { code: OFFSET_OUT_OF_RANGE_ERROR_CODE } = errorCodes.find(
  (e: any) => e.type === 'OFFSET_OUT_OF_RANGE'
)

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parse'.
const parse = async (data: any) => {
  const partitionsWithError = data.responses.map(({
    topicName,
    partitions
  }: any) => {
    return partitions
      .filter((partition: any) => failure(partition.errorCode))
      // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
      .map((partition: any) => Object.assign({}, partition, { topic: topicName }));
  })

  const errors = flatten(partitionsWithError)
  if (errors.length > 0) {
    const { errorCode, topic, partition } = errors[0]
    if (errorCode === OFFSET_OUT_OF_RANGE_ERROR_CODE) {
      throw new KafkaJSOffsetOutOfRange(createErrorFromCode(errorCode), { topic, partition })
    }

    throw createErrorFromCode(errorCode)
  }

  return data
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export {
  decode,
  parse,
}
