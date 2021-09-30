import isInvalidOffset from './isInvalidOffset.ts'

const { keys, assign } = Object

const indexPartitions = (obj: any, {
  partition,
  offset
}: any) => assign(obj, { [partition]: offset })
const indexTopics = (obj: any, {
  topic,
  partitions
}: any) =>
  assign(obj, { [topic]: partitions.reduce(indexPartitions, {}) })

export default (consumerOffsets: any, topicOffsets: any) => {
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
