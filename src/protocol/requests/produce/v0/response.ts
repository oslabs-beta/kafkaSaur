import {Decoder} from '../../../decoder.ts'
import { failure, createErrorFromCode } from '../../../error.ts'
import flatten from '../../../../utils/flatten.ts'

/**
 * v0
 * ProduceResponse => [TopicName [Partition ErrorCode Offset]]
 *   TopicName => string
 *   Partition => int32
 *   ErrorCode => int16
 *   Offset => int64
 */

const partition = (decoder: any) => ({
  partition: decoder.readInt32(),
  errorCode: decoder.readInt16(),
  offset: decoder.readInt64().toString()
})
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const topics = decoder.readArray((decoder: any) => ({
    topicName: decoder.readString(),
    partitions: decoder.readArray(partition)
  }))

  return {
    topics,
  }
}
//deno-lint-ignore require-await
const parse = async (data: any) => {
  const partitionsWithError = data.topics.map((topic: any) => {
    return topic.partitions.filter((partition: any) => failure(partition.errorCode));
  })

  const errors = flatten(partitionsWithError)
  if (errors.length > 0) {
    const { errorCode } = errors[0]
    throw createErrorFromCode(errorCode)
  }

  return data
}

export default {
  decode,
  parse,
}
