/** @format */

const createState = (topic: any) => ({
  topic,
  paused: new Set(),
  pauseAll: false,
  resumed: new Set(),
});

export class SubscriptionState {
  assignedPartitionsByTopic: any;
  subscriptionStatesByTopic: any;
  constructor() {
    this.assignedPartitionsByTopic = {};
    this.subscriptionStatesByTopic = {};
  }

  /**
   * Replace the current assignment with a new set of assignments
   *
   * @param {Array<TopicPartitions>} topicPartitions Example: [{ topic: 'topic-name', partitions: [1, 2] }]
   */
  assign(topicPartitions:any[] = []) {
    this.assignedPartitionsByTopic = topicPartitions.reduce(
      (assigned, { topic, partitions = [] }) => {
        return { ...assigned, [topic]: { topic, partitions } };
      },
      {}
    );
  }

  /**
   * @param {Array<TopicPartitions>} topicPartitions Example: [{ topic: 'topic-name', partitions: [1, 2] }]
   */
  pause(topicPartitions = []) {
    topicPartitions.forEach(({ topic, partitions }) => {
      const state = this.subscriptionStatesByTopic[topic] || createState(topic);

      if (typeof partitions === 'undefined') {
        state.paused.clear();
        state.resumed.clear();
        state.pauseAll = true;
      } else if (Array.isArray(partitions)) {
        (partitions as any).forEach((partition: any) => {
          state.paused.add(partition);
          state.resumed.delete(partition);
        });
        state.pauseAll = false;
      }

      this.subscriptionStatesByTopic[topic] = state;
    });
  }

  /**
   * @param {Array<TopicPartitions>} topicPartitions Example: [{ topic: 'topic-name', partitions: [1, 2] }]
   */
  resume(topicPartitions = []) {
    topicPartitions.forEach(({ topic, partitions }) => {
      const state = this.subscriptionStatesByTopic[topic] || createState(topic);

      if (typeof partitions === 'undefined') {
        state.paused.clear();
        state.resumed.clear();
        state.pauseAll = false;
      } else if (Array.isArray(partitions)) {
        (partitions as any).forEach((partition: any) => {
          state.paused.delete(partition);
          if (state.pauseAll) {
            state.resumed.add(partition);
          }
        });
      }

      this.subscriptionStatesByTopic[topic] = state;
    });
  }

  /**
   * @returns {Array<import("../../types").TopicPartitions>} topicPartitions
   * Example: [{ topic: 'topic-name', partitions: [1, 2] }]
   */
  assigned() {
    return Object.values(this.assignedPartitionsByTopic).map(
      ({ topic, partitions }: any) => ({
        topic,
        partitions: partitions.sort(),
      })
    );
  }

  /**
   * @returns {Array<import("../../types").TopicPartitions>} topicPartitions
   * Example: [{ topic: 'topic-name', partitions: [1, 2] }]
   */
  active() {
    return Object.values(this.assignedPartitionsByTopic).map(
      ({ topic, partitions }: any) => ({
        topic,
        partitions: partitions
          .filter((partition: any) => !this.isPaused(topic, partition))
          .sort(),
      })
    );
  }

  /**
   * @returns {Array<import("../../types").TopicPartitions>} topicPartitions
   * Example: [{ topic: 'topic-name', partitions: [1, 2] }]
   */
  paused() {
    return Object.values(this.assignedPartitionsByTopic)
      .map(({ topic, partitions }: any) => ({
        topic,
        partitions: partitions
          .filter((partition: any) => this.isPaused(topic, partition))
          .sort(),
      }))
      .filter(({ partitions }: any) => partitions.length !== 0);
  }

  isPaused(topic: any, partition: any) {
    const state = this.subscriptionStatesByTopic[topic];

    if (!state) {
      return false;
    }

    const partitionResumed = state.resumed.has(partition);
    const partitionPaused = state.paused.has(partition);

    return (state.pauseAll && !partitionResumed) || partitionPaused;
  }
}
