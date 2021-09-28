// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { Produce: apiKey } = require('../../apiKeys')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MessageSet... Remove this comment to see the full error message
const MessageSet = require('../../../messageSet')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Types'.
const { Types, lookupCodec } = require('../../../message/compression')

// Produce Request on or after v2 indicates the client can parse the timestamp field
// in the produce Response.

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
  acks,
  timeout,
  compression = Types.None,
  topicData
}: any) => ({
  apiKey,
  apiVersion: 2,
  apiName: 'Produce',
  expectResponse: () => acks !== 0,
  encode: async () => {
    const encodeTopic = topicEncoder(compression)
    const encodedTopicData = []

    for (const data of topicData) {
      encodedTopicData.push(await encodeTopic(data))
    }

    return new Encoder()
      .writeInt16(acks)
      .writeInt32(timeout)
      .writeArray(encodedTopicData)
  },
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'topicEncod... Remove this comment to see the full error message
const topicEncoder = (compression: any) => {
  const encodePartitions = partitionsEncoder(compression)

  return async ({
    topic,
    partitions
  }: any) => {
    const encodedPartitions = []

    for (const data of partitions) {
      encodedPartitions.push(await encodePartitions(data))
    }

    return new Encoder().writeString(topic).writeArray(encodedPartitions)
  };
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'partitions... Remove this comment to see the full error message
const partitionsEncoder = (compression: any) => async ({
  partition,
  messages
}: any) => {
  const messageSet = MessageSet({ messageVersion: 1, compression, entries: messages })

  if (compression === Types.None) {
    return new Encoder()
      .writeInt32(partition)
      .writeInt32(messageSet.size())
      .writeEncoder(messageSet)
  }

  const timestamp = messages[0].timestamp || Date.now()

  const codec = lookupCodec(compression)
  const compressedValue = await codec.compress(messageSet)
  const compressedMessageSet = MessageSet({
    messageVersion: 1,
    entries: [{ compression, timestamp, value: compressedValue }],
  })

  return new Encoder()
    .writeInt32(partition)
    .writeInt32(compressedMessageSet.size())
    .writeEncoder(compressedMessageSet)
}
