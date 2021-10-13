/** @format */

import flatten from '../utils/flatten.ts';

export default ({ topics }: any) => {
  const partitions = topics.map(({ topicName, partitions }: any) =>
    partitions.map((partition: any) => ({
      topicName,
      ...partition,
    }))
  );

  return flatten(partitions);
};
