import {Decoder} from '../../../decoder.ts'
import { failure, createErrorFromCode } from '../../../error.ts'
import flatten from '../../../../utils/flatten.ts'

/**
 * Metadata Response (Version: 0) => [brokers] [topic_metadata]
 *   brokers => node_id host port
 *     node_id => INT32
 *     host => STRING
 *     port => INT32
 *   topic_metadata => topic_error_code topic [partition_metadata]
 *     topic_error_code => INT16
 *     topic => STRING
 *     partition_metadata => partition_error_code partition_id leader [replicas] [isr]
 *       partition_error_code => INT16
 *       partition_id => INT32
 *       leader => INT32
 *       replicas => INT32
 *       isr => INT32
 */

const broker = (decoder: any) => ({
  nodeId: decoder.readInt32(),
  host: decoder.readString(),
  port: decoder.readInt32()
})

const topicMetadata = (decoder: any) => ({
  topicErrorCode: decoder.readInt16(),
  topic: decoder.readString(),
  partitionMetadata: decoder.readArray(partitionMetadata)
})

const partitionMetadata = (decoder: any) => ({
  partitionErrorCode: decoder.readInt16(),
  partitionId: decoder.readInt32(),

  // leader: The node id for the kafka broker currently acting as leader
  // for this partition
  leader: decoder.readInt32(),

  replicas: decoder.readArray((d: any) => d.readInt32()),
  isr: decoder.readArray((d: any) => d.readInt32())
})
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  return {
    brokers: decoder.readArray(broker),
    topicMetadata: decoder.readArray(topicMetadata),
  }
}
//deno-lint-ignore require-await
const parse = async (data: any) => {
  const topicsWithErrors = data.topicMetadata.filter((topic: any) => failure(topic.topicErrorCode))
  if (topicsWithErrors.length > 0) {
    const { topicErrorCode } = topicsWithErrors[0]
    throw createErrorFromCode(topicErrorCode)
  }

  const partitionsWithErrors = data.topicMetadata.map((topic: any) => {
    return topic.partitionMetadata.filter((partition: any) => failure(partition.partitionErrorCode));
  })

  const errors = flatten(partitionsWithErrors)
  if (errors.length > 0) {
    const { partitionErrorCode } = errors[0]
    throw createErrorFromCode(partitionErrorCode)
  }

  return data
}

export default {
  decode,
  parse,
}
