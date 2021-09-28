// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseV0'.
const { parse: parseV0 } = require('../v0/response')

/**
 * v1 (supported in 0.9.0 or later)
 * ProduceResponse => [TopicName [Partition ErrorCode Offset]] ThrottleTime
 *   TopicName => string
 *   Partition => int32
 *   ErrorCode => int16
 *   Offset => int64
 *   ThrottleTime => int32
 */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'partition'... Remove this comment to see the full error message
const partition = (decoder: any) => ({
  partition: decoder.readInt32(),
  errorCode: decoder.readInt16(),
  offset: decoder.readInt64().toString()
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
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

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  decode,
  parse: parseV0,
}
