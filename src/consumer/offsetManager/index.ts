import Long from '../../utils/long.ts'
import flatten from '../../utils/flatten.ts'
import isInvalidOffset from './isInvalidOffset.ts'
import initializeConsumerOffsets from './initializeConsumerOffsets.ts'
import { events } from '../instrumentationEvents.ts'

const { COMMIT_OFFSETS } = events;

const { keys, assign } = Object
const indexTopics = (topics: any) => topics.reduce((obj: any, topic: any) => assign(obj, { [topic]: {} }), {})

const PRIVATE = {
  COMMITTED_OFFSETS: Symbol('private:OffsetManager:committedOffsets') as unknown as string,
}
export class OffsetManager {
  [key: string]: any
  autoCommit: any;
  autoCommitInterval: any;
  autoCommitThreshold: any;
  cluster: any;
  coordinator: any;
  generationId: any;
  groupId: any;
  instrumentationEmitter: any;
  lastCommit: any;
  memberAssignment: any;
  memberId: any;
  resolvedOffsets: any;
  topicConfigurations: any;
  topics: any;
  /**
   * @param {Object} options
   * @param {import("../../../types").Cluster} options.cluster
   * @param {import("../../../types").Broker} options.coordinator
   * @param {import("../../../types").IMemberAssignment} options.memberAssignment
   * @param {boolean} options.autoCommit
   * @param {number | null} options.autoCommitInterval
   * @param {number | null} options.autoCommitThreshold
   * @param {{[topic: string]: { fromBeginning: boolean }}} options.topicConfigurations
   * @param {import("../../instrumentation/emitter")} options.instrumentationEmitter
   * @param {string} options.groupId
   * @param {number} options.generationId
   * @param {string} options.memberId
   */
  constructor({
    cluster,
    coordinator,
    memberAssignment,
    autoCommit,
    autoCommitInterval,
    autoCommitThreshold,
    topicConfigurations,
    instrumentationEmitter,
    groupId,
    generationId,
    memberId
  }: any) {
    this.cluster = cluster
    this.coordinator = coordinator

    // memberAssignment format:
    // {
    //   'topic1': [0, 1, 2, 3],
    //   'topic2': [0, 1, 2, 3, 4, 5],
    // }
    this.memberAssignment = memberAssignment

    this.topicConfigurations = topicConfigurations
    this.instrumentationEmitter = instrumentationEmitter
    this.groupId = groupId
    this.generationId = generationId
    this.memberId = memberId

    this.autoCommit = autoCommit
    this.autoCommitInterval = autoCommitInterval
    this.autoCommitThreshold = autoCommitThreshold
    this.lastCommit = Date.now()

    this.topics = keys(memberAssignment)
    this.clearAllOffsets()
  }

  /**
   * @param {string} topic
   * @param {number} partition
   * @returns {Long}
   */
  nextOffset(topic: any, partition: any) {
    if (!this.resolvedOffsets[topic][partition]) {
      this.resolvedOffsets[topic][partition] = this.committedOffsets()[topic][partition]
    }

    let offset = this.resolvedOffsets[topic][partition]
    if (isInvalidOffset(offset)) {
      offset = '0'
    }

    return Long.fromValue(offset)
  }

  /**
   * @returns {Promise<import("../../../types").Broker>}
   */
  async getCoordinator() {
    if (!this.coordinator.isConnected()) {
      this.coordinator = await this.cluster.findBroker(this.coordinator)
    }

    return this.coordinator
  }

  /**
   * @param {import("../../../types").TopicPartition} topicPartition
   */
  resetOffset({
    topic,
    partition
  }: any) {
    this.resolvedOffsets[topic][partition] = this.committedOffsets()[topic][partition]
  }

  /**
   * @param {import("../../../types").TopicPartitionOffset} topicPartitionOffset
   */
  resolveOffset({
    topic,
    partition,
    offset
  }: any) {
    this.resolvedOffsets[topic][partition] = Long.fromValue(offset)
      .add(1)
      .toString()
  }

  /**
   * @returns {Long}
   */
  countResolvedOffsets() {
    const committedOffsets = this.committedOffsets()

    const subtractOffsets = (resolvedOffset: any, committedOffset: any) => {
      const resolvedOffsetLong = Long.fromValue(resolvedOffset)
      return isInvalidOffset(committedOffset)
        ? resolvedOffsetLong
        : resolvedOffsetLong.subtract(Long.fromValue(committedOffset))
    }

    const subtractPartitionOffsets = (resolvedTopicOffsets: any, committedTopicOffsets: any) =>
      keys(resolvedTopicOffsets).map(partition =>
        subtractOffsets(resolvedTopicOffsets[partition], committedTopicOffsets[partition])
      )

    const subtractTopicOffsets = (topic: any) => subtractPartitionOffsets(this.resolvedOffsets[topic], committedOffsets[topic])

    const offsetsDiff = this.topics.map(subtractTopicOffsets)
    return flatten(offsetsDiff).reduce((sum: any, offset: any) => sum.add(offset), Long.fromValue(0));
  }

  /**
   * @param {import("../../../types").TopicPartition} topicPartition
   */
  async setDefaultOffset({
    topic,
    partition
  }: any) {
    const { groupId, generationId, memberId } = this
    const defaultOffset = this.cluster.defaultOffset(this.topicConfigurations[topic])
    const coordinator = await this.getCoordinator()

    if (!this.autoCommit) {
      this.resolveOffset({
        topic,
        partition,
        offset: defaultOffset,
      })
      return
    }

    await coordinator.offsetCommit({
      groupId,
      memberId,
      groupGenerationId: generationId,
      topics: [
        {
          topic,
          partitions: [{ partition, offset: defaultOffset }],
        },
      ],
    })

    this.clearOffsets({ topic, partition })
  }

  /**
   * Commit the given offset to the topic/partition. If the consumer isn't assigned to the given
   * topic/partition this method will be a NO-OP.
   *
   * @param {import("../../../types").TopicPartitionOffset} topicPartitionOffset
   */
  async seek({
    topic,
    partition,
    offset
  }: any) {
    if (!this.memberAssignment[topic] || !this.memberAssignment[topic].includes(partition)) {
      return
    }

    if (!this.autoCommit) {
      this.resolveOffset({
        topic,
        partition,
        offset: Long.fromValue(offset)
          .subtract(1)
          .toString(),
      })
      return
    }

    const { groupId, generationId, memberId } = this
    const coordinator = await this.getCoordinator()

    await coordinator.offsetCommit({
      groupId,
      memberId,
      groupGenerationId: generationId,
      topics: [
        {
          topic,
          partitions: [{ partition, offset }],
        },
      ],
    })

    this.clearOffsets({ topic, partition })
  }

  async commitOffsetsIfNecessary() {
    const now = Date.now()

    const timeoutReached =
      this.autoCommitInterval != null && now >= this.lastCommit + this.autoCommitInterval

    const thresholdReached =
      this.autoCommitThreshold != null &&
      this.countResolvedOffsets().gte(Long.fromValue(this.autoCommitThreshold))

    if (timeoutReached || thresholdReached) {
      return this.commitOffsets()
    }
  }

  /**
   * Return all locally resolved offsets which are not marked as committed, by topic-partition.
   * @returns {OffsetsByTopicPartition}
   *
   * @typedef {Object} OffsetsByTopicPartition
   * @property {TopicOffsets[]} topics
   *
   * @typedef {Object} TopicOffsets
   * @property {PartitionOffset[]} partitions
   *
   * @typedef {Object} PartitionOffset
   * @property {string} partition
   * @property {string} offset
   */
  uncommittedOffsets() {
    const offsets = (topic: any) => keys(this.resolvedOffsets[topic])
    const emptyPartitions = ({
      partitions
    }: any) => partitions.length > 0
    const toPartitions = (topic: any) => (partition: any) => ({
      partition,
      offset: this.resolvedOffsets[topic][partition]
    })
    const changedOffsets = (topic: any) => ({
      partition,
      offset
    }: any) => {
      return (
        offset !== this.committedOffsets()[topic][partition] &&
        Long.fromValue(offset).greaterThanOrEqual(0)
      )
    }

    // Select and format updated partitions
    const topicsWithPartitionsToCommit = this.topics
      .map((topic: any) => ({
      topic,

      partitions: offsets(topic)
        .map(toPartitions(topic))
        .filter(changedOffsets(topic))
    }))
      .filter(emptyPartitions)

    return { topics: topicsWithPartitionsToCommit }
  }

  async commitOffsets(offsets: {[key: string]: any} = {}) {
    const { groupId, generationId, memberId } = this
    const { topics = this.uncommittedOffsets().topics } = offsets

    if (topics.length === 0) {
      this.lastCommit = Date.now()
      return
    }

    const payload = {
      groupId,
      memberId,
      groupGenerationId: generationId,
      topics,
    }

    try {
      const coordinator = await this.getCoordinator()
      await coordinator.offsetCommit(payload)
      this.instrumentationEmitter.emit(COMMIT_OFFSETS, payload)

      // Update local reference of committed offsets
      topics.forEach(({
        topic,
        partitions
      }: any) => {
        const updatedOffsets = partitions.reduce(
          (obj: any, {
            partition,
            offset
          }: any) => assign(obj, { [partition]: offset }),
          {}
        )
        assign(this.committedOffsets()[topic], updatedOffsets)
      })

      this.lastCommit = Date.now()
    } catch (e : any) {
      // metadata is stale, the coordinator has changed due to a restart or
      // broker reassignment
      if (e.type === 'NOT_COORDINATOR_FOR_GROUP') {
        await this.cluster.refreshMetadata()
      }

      throw e
    }
  }

  async resolveOffsets() {
    const { groupId } = this
    const invalidOffset = (topic: any) => (partition: any) => {
      return isInvalidOffset(this.committedOffsets()[topic][partition])
    }

    const pendingPartitions = this.topics
      .map((topic: any) => ({
      topic,

      partitions: this.memberAssignment[topic]
        .filter(invalidOffset(topic))
        .map((partition: any) => ({
        partition
      }))
    }))
      .filter((t: any) => t.partitions.length > 0)

    if (pendingPartitions.length === 0) {
      return
    }

    const coordinator = await this.getCoordinator()
    const { responses: consumerOffsets } = await coordinator.offsetFetch({
      groupId,
      topics: pendingPartitions,
    })

    const unresolvedPartitions = consumerOffsets.map(({
      topic,
      partitions
    }: any) =>
      assign(
        {
          topic,
          partitions: partitions
            .filter(({
            offset
          }: any) => isInvalidOffset(offset))
            .map(({
            partition
          }: any) => assign({ partition })),
        },
        this.topicConfigurations[topic]
      )
    )

    const indexPartitions = (obj: any, {
      partition,
      offset
    }: any) => {
      return assign(obj, { [partition]: offset })
    }

    const hasUnresolvedPartitions = () => unresolvedPartitions.some((t: any) => t.partitions.length > 0)

    let offsets = consumerOffsets
    if (hasUnresolvedPartitions()) {
      const topicOffsets = await this.cluster.fetchTopicsOffset(unresolvedPartitions)
      offsets = initializeConsumerOffsets(consumerOffsets, topicOffsets)
    }

    offsets.forEach(({
      topic,
      partitions
    }: any) => {
      this.committedOffsets()[topic] = partitions.reduce(indexPartitions, {
        ...this.committedOffsets()[topic],
      })
    })
  }

  /**
   * @private
   * @param {import("../../../types").TopicPartition} topicPartition
   */
  clearOffsets({
    topic,
    partition
  }: any) {
    delete this.committedOffsets()[topic][partition]
    delete this.resolvedOffsets[topic][partition]
  }

  /**
   * @private
   */
  clearAllOffsets() {
    const committedOffsets = this.committedOffsets()

    for (const topic in committedOffsets) {
      delete committedOffsets[topic]
    }

    for (const topic of this.topics) {
      committedOffsets[topic] = {}
    }

    this.resolvedOffsets = indexTopics(this.topics)
  }

  committedOffsets() {
    if (!this[(PRIVATE as any).COMMITTED_OFFSETS]) {
      this[(PRIVATE as any).COMMITTED_OFFSETS] = this.groupId
    ? this.cluster.committedOffsets({ groupId: this.groupId })
    : {};
    }

    return this[(PRIVATE as any).COMMITTED_OFFSETS];
  }
}
