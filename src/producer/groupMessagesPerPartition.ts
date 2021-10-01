/** @format */

export default ({ topic, partitionMetadata, messages, partitioner }: any) => {
  if (partitionMetadata.length === 0) {
    return {};
  }

  return messages.reduce((result: any, message: any) => {
    const partition = partitioner({ topic, partitionMetadata, message });
    const current = result[partition] || [];
    return Object.assign(result, { [partition]: [...current, message] });
  }, {});
};
