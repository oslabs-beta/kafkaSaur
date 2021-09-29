// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseV0'.
const { parse: parseV0 } = require('../v0/response')

/**
 * Metadata Response (Version: 1) => [brokers] controller_id [topic_metadata]
 *   brokers => node_id host port rack
 *     node_id => INT32
 *     host => STRING
 *     port => INT32
 *     rack => NULLABLE_STRING
 *   controller_id => INT32
 *   topic_metadata => topic_error_code topic is_internal [partition_metadata]
 *     topic_error_code => INT16
 *     topic => STRING
 *     is_internal => BOOLEAN
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
  port: decoder.readInt32(),
  rack: decoder.readString()
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'topicMetad... Remove this comment to see the full error message
const topicMetadata = (decoder: any) => ({
  topicErrorCode: decoder.readInt16(),
  topic: decoder.readString(),
  isInternal: decoder.readBoolean(),
  partitionMetadata: decoder.readArray(partitionMetadata)
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'partitionM... Remove this comment to see the full error message
const partitionMetadata = (decoder: any) => ({
  partitionErrorCode: decoder.readInt16(),
  partitionId: decoder.readInt32(),
  leader: decoder.readInt32(),
  replicas: decoder.readArray((d: any) => d.readInt32()),
  isr: decoder.readArray((d: any) => d.readInt32())
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  return {
    brokers: decoder.readArray(broker),
    controllerId: decoder.readInt32(),
    topicMetadata: decoder.readArray(topicMetadata),
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  decode,
  parse: parseV0,
}