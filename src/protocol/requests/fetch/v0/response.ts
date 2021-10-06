import {Decoder} from '../../../decoder.ts'
import { KafkaJSOffsetOutOfRange } from '../../../../errors.ts'
import { failure, createErrorFromCode, errorCodes } from '../../../error.ts'
import flatten from '../../../../utils/flatten.ts'
import MessageSetDecoder from '../../../messageSet/decoder.ts'

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

const decodePartition = async (decoder: any) => ({
  partition: decoder.readInt32(),
  errorCode: decoder.readInt16(),
  highWatermark: decoder.readInt64().toString(),
  messages: await MessageSetDecoder(decoder)
})

const decodeResponse = async (decoder: any) => ({
  topicName: decoder.readString(),
  partitions: await decoder.readArrayAsync(decodePartition)
})

const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const responses = await decoder.readArrayAsync(decodeResponse)

  return {
    responses,
  }
}

const { code : OFFSET_OUT_OF_RANGE_ERROR_CODE } : any = errorCodes.find(
  (e: any) => e.type === 'OFFSET_OUT_OF_RANGE'
)
//deno-lint-ignore require-await
const parse = async (data: any) => {
  const partitionsWithError = data.responses.map(({
    topicName,
    partitions
  }: any) => {
    return partitions
      .filter((partition: any) => failure(partition.errorCode))
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

export default {
  decode,
  parse,
}
