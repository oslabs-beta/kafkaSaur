// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'failure'.
const { failure, createErrorFromCode } = require('../../../error')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'flatten'.
const flatten = require('../../../../utils/flatten')

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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'broker'.
const broker = (decoder: any) => ({
  nodeId: decoder.readInt32(),
  host: decoder.readString(),
  port: decoder.readInt32()
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'topicMetad... Remove this comment to see the full error message
const topicMetadata = (decoder: any) => ({
  topicErrorCode: decoder.readInt16(),
  topic: decoder.readString(),
  partitionMetadata: decoder.readArray(partitionMetadata)
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'partitionM... Remove this comment to see the full error message
const partitionMetadata = (decoder: any) => ({
  partitionErrorCode: decoder.readInt16(),
  partitionId: decoder.readInt32(),

  // leader: The node id for the kafka broker currently acting as leader
  // for this partition
  leader: decoder.readInt32(),

  replicas: decoder.readArray((d: any) => d.readInt32()),
  isr: decoder.readArray((d: any) => d.readInt32())
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  return {
    brokers: decoder.readArray(broker),
    topicMetadata: decoder.readArray(topicMetadata),
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parse'.
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

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  decode,
  parse,
}
