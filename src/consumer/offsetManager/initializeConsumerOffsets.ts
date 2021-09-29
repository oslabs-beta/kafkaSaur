import isInvalidOffset from './isInvalidOffset.ts'

const { keys, assign } = Object

const indexPartitions = (obj: any, {
  partition,
  offset
}: any) => assign(obj, { [partition]: offset })
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'indexTopic... Remove this comment to see the full error message
const indexTopics = (obj: any, {
  topic,
  partitions
}: any) =>
  assign(obj, { [topic]: partitions.reduce(indexPartitions, {}) })

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = (consumerOffsets: any, topicOffsets: any) => {
  const indexedConsumerOffsets = consumerOffsets.reduce(indexTopics, {})
  const indexedTopicOffsets = topicOffsets.reduce(indexTopics, {})

  return keys(indexedConsumerOffsets).map(topic => {
    const partitions = indexedConsumerOffsets[topic]
    return {
      topic,
      partitions: keys(partitions).map(partition => {
        const offset = partitions[partition]
        const resolvedOffset = isInvalidOffset(offset)
          ? indexedTopicOffsets[topic][partition]
          : offset

        return { partition: Number(partition), offset: resolvedOffset }
      }),
    }
  })
}
