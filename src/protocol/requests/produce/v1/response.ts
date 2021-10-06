import {Decoder} from '../../../decoder.ts'
import response from '../v0/response.ts'

const parse = response.parse;
/**
 * v1 (supported in 0.9.0 or later)
 * ProduceResponse => [TopicName [Partition ErrorCode Offset]] ThrottleTime
 *   TopicName => string
 *   Partition => int32
 *   ErrorCode => int16
 *   Offset => int64
 *   ThrottleTime => int32
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

  const throttleTime = decoder.readInt32()

  return {
    topics,
    throttleTime,
  }
}

export default{
  decode,
  parse
}
