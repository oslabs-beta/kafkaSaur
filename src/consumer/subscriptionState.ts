const createState = (topic: any) => ({
  topic,
  // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Set'. Do you need to change your... Remove this comment to see the full error message
  paused: new Set(),
  pauseAll: false,
  // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Set'. Do you need to change your... Remove this comment to see the full error message
  resumed: new Set()
})

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class SubscriptionState {
  assignedPartitionsByTopic: any;
  subscriptionStatesByTopic: any;
  constructor() {
    this.assignedPartitionsByTopic = {}
    this.subscriptionStatesByTopic = {}
  }

  /**
   * Replace the current assignment with a new set of assignments
   *
   * @param {Array<TopicPartitions>} topicPartitions Example: [{ topic: 'topic-name', partitions: [1, 2] }]
   */
  assign(topicPartitions = []) {
    this.assignedPartitionsByTopic = topicPartitions.reduce(
      (assigned, { topic, partitions = [] }) => {
        return { ...assigned, [topic]: { topic, partitions } }
      },
      {}
    )
  }

  /**
   * @param {Array<TopicPartitions>} topicPartitions Example: [{ topic: 'topic-name', partitions: [1, 2] }]
   */
  pause(topicPartitions = []) {
    topicPartitions.forEach(({ topic, partitions }) => {
      const state = this.subscriptionStatesByTopic[topic] || createState(topic)

      if (typeof partitions === 'undefined') {
        state.paused.clear()
        state.resumed.clear()
        state.pauseAll = true
      } else if (Array.isArray(partitions)) {
        (partitions as any).forEach((partition: any) => {
    state.paused.add(partition);
    state.resumed.delete(partition);
});
        state.pauseAll = false
      }

      this.subscriptionStatesByTopic[topic] = state
    })
  }

  /**
   * @param {Array<TopicPartitions>} topicPartitions Example: [{ topic: 'topic-name', partitions: [1, 2] }]
   */
  resume(topicPartitions = []) {
    topicPartitions.forEach(({ topic, partitions }) => {
      const state = this.subscriptionStatesByTopic[topic] || createState(topic)

      if (typeof partitions === 'undefined') {
        state.paused.clear()
        state.resumed.clear()
        state.pauseAll = false
      } else if (Array.isArray(partitions)) {
        (partitions as any).forEach((partition: any) => {
    state.paused.delete(partition);
    if (state.pauseAll) {
        state.resumed.add(partition);
    }
});
      }

      this.subscriptionStatesByTopic[topic] = state
    })
  }

  /**
   * @returns {Array<import("../../types").TopicPartitions>} topicPartitions
   * Example: [{ topic: 'topic-name', partitions: [1, 2] }]
   */
  assigned() {
    // @ts-expect-error ts-migrate(2550) FIXME: Property 'values' does not exist on type 'ObjectCo... Remove this comment to see the full error message
    return Object.values(this.assignedPartitionsByTopic).map(({
      topic,
      partitions
    }: any) => ({
      topic,
      partitions: partitions.sort(),
    }));
  }

  /**
   * @returns {Array<import("../../types").TopicPartitions>} topicPartitions
   * Example: [{ topic: 'topic-name', partitions: [1, 2] }]
   */
  active() {
    // @ts-expect-error ts-migrate(2550) FIXME: Property 'values' does not exist on type 'ObjectCo... Remove this comment to see the full error message
    return Object.values(this.assignedPartitionsByTopic).map(({
      topic,
      partitions
    }: any) => ({
      topic,
      partitions: partitions.filter((partition: any) => !this.isPaused(topic, partition)).sort(),
    }));
  }

  /**
   * @returns {Array<import("../../types").TopicPartitions>} topicPartitions
   * Example: [{ topic: 'topic-name', partitions: [1, 2] }]
   */
  paused() {
    // @ts-expect-error ts-migrate(2550) FIXME: Property 'values' does not exist on type 'ObjectCo... Remove this comment to see the full error message
    return Object.values(this.assignedPartitionsByTopic)
      .map(({
      topic,
      partitions
    }: any) => ({
        topic,
        partitions: partitions.filter((partition: any) => this.isPaused(topic, partition)).sort(),
      }))
      .filter(({
      partitions
    }: any) => partitions.length !== 0);
  }

  isPaused(topic: any, partition: any) {
    const state = this.subscriptionStatesByTopic[topic]

    if (!state) {
      return false
    }

    const partitionResumed = state.resumed.has(partition)
    const partitionPaused = state.paused.has(partition)

    return (state.pauseAll && !partitionResumed) || partitionPaused
  }
}
