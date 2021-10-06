/** @format */

import { MemberMetadata, MemberAssignment } from '../../assignerProtocol.ts';
import flatten from '../../../utils/flatten.ts';

/**
 * RoundRobinAssigner
 * @param {Cluster} cluster
 * @returns {function}
 */

export default ({ cluster }: any) => ({
  name: 'RoundRobinAssigner',
  version: 1,

  /**
   * Assign the topics to the provided members.
   *
   * The members array contains information about each member, `memberMetadata` is the result of the
   * `protocol` operation.
   *
   * @param {array} members array of members, e.g:
                              [{ memberId: 'test-5f93f5a3', memberMetadata: Buffer }]
   * @param {array} topics
   * @returns {array} object partitions per topic per member, e.g:
   *                   [
   *                     {
   *                       memberId: 'test-5f93f5a3',
   *                       memberAssignment: {
   *                         'topic-A': [0, 2, 4, 6],
   *                         'topic-B': [1],
   *                       },
   *                     },
   *                     {
   *                       memberId: 'test-3d3d5341',
   *                       memberAssignment: {
   *                         'topic-A': [1, 3, 5],
   *                         'topic-B': [0, 2],
   *                       },
   *                     }
   *                   ]
   */
  // deno-lint-ignore require-await
  async assign({ members, topics }: any) {
    const membersCount = members.length;
    const sortedMembers = members.map(({ memberId }: any) => memberId).sort();
    const assignment: {[key: string]: any} = {};

    const topicsPartionArrays = topics.map((topic: any) => {
      const partitionMetadata = cluster.findTopicPartitionMetadata(topic);
      return partitionMetadata.map((m: any) => ({
        topic: topic,
        partitionId: m.partitionId,
      }));
    });
    const topicsPartitions = flatten(topicsPartionArrays);

    topicsPartitions.forEach((topicPartition: any, i: any) => {
      const assignee = sortedMembers[i % membersCount];

      if (!assignment[assignee]) {
        assignment[assignee] = Object.create(null);
      }

      if (!assignment[assignee][topicPartition.topic]) {
        assignment[assignee][topicPartition.topic] = [];
      }

      assignment[assignee][topicPartition.topic].push(
        topicPartition.partitionId
      );
    });

    return Object.keys(assignment).map((memberId) => ({
      memberId,
      memberAssignment: MemberAssignment.encode({
        version: this.version,
        assignment: assignment[memberId],
      }),
    }));
  },

  protocol({ topics }: any) {
    return {
      name: this.name,
      metadata: MemberMetadata.encode({
        version: this.version,
        topics,
      }),
    };
  },
});
