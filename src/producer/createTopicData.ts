/** @format */

export default (topicDataForBroker: any) => {
  return topicDataForBroker.map(
    ({
      topic,
      partitions,
      messagesPerPartition,
      sequencePerPartition,
    }: any) => ({
      topic,
      partitions: partitions.map((partition: any) => ({
        partition,
        firstSequence: sequencePerPartition[partition],
        messages: messagesPerPartition[partition],
      })),
    })
  );
};
