// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export (topicDataForBroker: any) => {
  return topicDataForBroker.map(
    ({
      topic,
      partitions,
      messagesPerPartition,
      sequencePerPartition
    }: any) => ({
      topic,
      partitions: partitions.map((partition: any) => ({
        partition,
        firstSequence: sequencePerPartition[partition],
        messages: messagesPerPartition[partition]
      })),
    })
  );
}
