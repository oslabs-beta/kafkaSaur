// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'flatten'.
const flatten = require('../utils/flatten')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sleep'.
const sleep = require('../utils/sleep')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BufferedAs... Remove this comment to see the full error message
const BufferedAsyncIterator = require('../utils/bufferedAsyncIterator')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'websiteUrl... Remove this comment to see the full error message
const websiteUrl = require('../utils/websiteUrl')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'arrayDiff'... Remove this comment to see the full error message
const arrayDiff = require('../utils/arrayDiff')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createRetr... Remove this comment to see the full error message
const createRetry = require('../retry')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sharedProm... Remove this comment to see the full error message
const sharedPromiseTo = require('../utils/sharedPromiseTo')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'OffsetMana... Remove this comment to see the full error message
const OffsetManager = require('./offsetManager')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Batch'.
const Batch = require('./batch')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const SeekOffsets = require('./seekOffsets')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Subscripti... Remove this comment to see the full error message
const SubscriptionState = require('./subscriptionState')
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CONNECT'.
  events: { GROUP_JOIN, HEARTBEAT, CONNECT, RECEIVED_UNSUBSCRIBED_TOPICS },
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./instrumentationEvents')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MemberAssi... Remove this comment to see the full error message
const { MemberAssignment } = require('./assignerProtocol')
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSErr... Remove this comment to see the full error message
  KafkaJSError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSNon... Remove this comment to see the full error message
  KafkaJSNonRetriableError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSSta... Remove this comment to see the full error message
  KafkaJSStaleTopicMetadataAssignment,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'keys'.
const { keys } = Object

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'STALE_META... Remove this comment to see the full error message
const STALE_METADATA_ERRORS = [
  'LEADER_NOT_AVAILABLE',
  // Fetch before v9 uses NOT_LEADER_FOR_PARTITION
  'NOT_LEADER_FOR_PARTITION',
  // Fetch after v9 uses {FENCED,UNKNOWN}_LEADER_EPOCH
  'FENCED_LEADER_EPOCH',
  'UNKNOWN_LEADER_EPOCH',
  'UNKNOWN_TOPIC_OR_PARTITION',
]

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isRebalanc... Remove this comment to see the full error message
const isRebalancing = (e: any) => e.type === 'REBALANCE_IN_PROGRESS' || e.type === 'NOT_COORDINATOR_FOR_GROUP'

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PRIVATE'.
const PRIVATE = {
  // @ts-expect-error ts-migrate(2585) FIXME: 'Symbol' only refers to a type, but is being used ... Remove this comment to see the full error message
  JOIN: Symbol('private:ConsumerGroup:join'),
  // @ts-expect-error ts-migrate(2585) FIXME: 'Symbol' only refers to a type, but is being used ... Remove this comment to see the full error message
  SYNC: Symbol('private:ConsumerGroup:sync'),
  // @ts-expect-error ts-migrate(2585) FIXME: 'Symbol' only refers to a type, but is being used ... Remove this comment to see the full error message
  HEARTBEAT: Symbol('private:ConsumerGroup:heartbeat'),
  // @ts-expect-error ts-migrate(2585) FIXME: 'Symbol' only refers to a type, but is being used ... Remove this comment to see the full error message
  SHAREDHEARTBEAT: Symbol('private:ConsumerGroup:sharedHeartbeat'),
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class ConsumerGroup {
    assigners: any;
    autoCommit: any;
    autoCommitInterval: any;
    autoCommitThreshold: any;
    cluster: any;
    coordinator: any;
    generationId: any;
    groupId: any;
    groupProtocol: any;
    instrumentationEmitter: any;
    isolationLevel: any;
    lastRequest: any;
    leaderId: any;
    logger: any;
    maxBytes: any;
    maxBytesPerPartition: any;
    maxWaitTime: any;
    memberId: any;
    members: any;
    metadataMaxAge: any;
    minBytes: any;
    offsetManager: any;
    partitionsPerSubscribedTopic: any;
    preferredReadReplicasPerTopicPartition: any;
    rackId: any;
    rebalanceTimeout: any;
    retrier: any;
    seekOffset: any;
    sessionTimeout: any;
    subscriptionState: any;
    topicConfigurations: any;
    topics: any;
    topicsSubscribed: any;
    constructor({ retry, cluster, groupId, topics, topicConfigurations, logger, instrumentationEmitter, assigners, sessionTimeout, rebalanceTimeout, maxBytesPerPartition, minBytes, maxBytes, maxWaitTimeInMs, autoCommit, autoCommitInterval, autoCommitThreshold, isolationLevel, rackId, metadataMaxAge }: any) {
        /** @type {import("../../types").Cluster} */
        this.cluster = cluster;
        this.groupId = groupId;
        this.topics = topics;
        this.topicsSubscribed = topics;
        this.topicConfigurations = topicConfigurations;
        this.logger = logger.namespace('ConsumerGroup');
        this.instrumentationEmitter = instrumentationEmitter;
        // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
        this.retrier = createRetry(Object.assign({}, retry));
        this.assigners = assigners;
        this.sessionTimeout = sessionTimeout;
        this.rebalanceTimeout = rebalanceTimeout;
        this.maxBytesPerPartition = maxBytesPerPartition;
        this.minBytes = minBytes;
        this.maxBytes = maxBytes;
        this.maxWaitTime = maxWaitTimeInMs;
        this.autoCommit = autoCommit;
        this.autoCommitInterval = autoCommitInterval;
        this.autoCommitThreshold = autoCommitThreshold;
        this.isolationLevel = isolationLevel;
        this.rackId = rackId;
        this.metadataMaxAge = metadataMaxAge;
        this.seekOffset = new SeekOffsets();
        this.coordinator = null;
        this.generationId = null;
        this.leaderId = null;
        this.memberId = null;
        this.members = null;
        this.groupProtocol = null;
        this.partitionsPerSubscribedTopic = null;
        /**
         * Preferred read replica per topic and partition
         *
         * Each of the partitions tracks the preferred read replica (`nodeId`) and a timestamp
         * until when that preference is valid.
         *
         * @type {{[topicName: string]: {[partition: number]: {nodeId: number, expireAt: number}}}}
         */
        this.preferredReadReplicasPerTopicPartition = {};
        this.offsetManager = null;
        this.subscriptionState = new SubscriptionState();
        this.lastRequest = Date.now();
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this[PRIVATE.SHAREDHEARTBEAT] = sharedPromiseTo(async ({ interval }: any) => {
            const { groupId, generationId, memberId } = this;
            const now = Date.now();
            if (memberId && now >= this.lastRequest + interval) {
                const payload = {
                    groupId,
                    memberId,
                    groupGenerationId: generationId,
                };
                await this.coordinator.heartbeat(payload);
                this.instrumentationEmitter.emit(HEARTBEAT, payload);
                this.lastRequest = Date.now();
            }
        });
    }
    isLeader() {
        return this.leaderId && this.memberId === this.leaderId;
    }
    async connect() {
        await this.cluster.connect();
        this.instrumentationEmitter.emit(CONNECT);
        await this.cluster.refreshMetadataIfNecessary();
    }
    async [(PRIVATE as any).JOIN]() {
        const { groupId, sessionTimeout, rebalanceTimeout } = this;
        this.coordinator = await this.cluster.findGroupCoordinator({ groupId });
        const groupData = await this.coordinator.joinGroup({
            groupId,
            sessionTimeout,
            rebalanceTimeout,
            memberId: this.memberId || '',
            groupProtocols: this.assigners.map((assigner: any) => assigner.protocol({
                topics: this.topicsSubscribed,
            })),
        });
        this.generationId = groupData.generationId;
        this.leaderId = groupData.leaderId;
        this.memberId = groupData.memberId;
        this.members = groupData.members;
        this.groupProtocol = groupData.groupProtocol;
    }
    async leave() {
        const { groupId, memberId } = this;
        if (memberId) {
            await this.coordinator.leaveGroup({ groupId, memberId });
            this.memberId = null;
        }
    }
    async [(PRIVATE as any).SYNC]() {
        let assignment = [];
        const { groupId, generationId, memberId, members, groupProtocol, topics, topicsSubscribed, coordinator, } = this;
        if (this.isLeader()) {
            this.logger.debug('Chosen as group leader', { groupId, generationId, memberId, topics });
            const assigner = this.assigners.find(({ name }: any) => name === groupProtocol);
            if (!assigner) {
                throw new KafkaJSNonRetriableError(`Unsupported partition assigner "${groupProtocol}", the assigner wasn't found in the assigners list`);
            }
            await this.cluster.refreshMetadata();
            assignment = await assigner.assign({ members, topics: topicsSubscribed });
            this.logger.debug('Group assignment', {
                groupId,
                generationId,
                groupProtocol,
                assignment,
                topics: topicsSubscribed,
            });
        }
        // Keep track of the partitions for the subscribed topics
        this.partitionsPerSubscribedTopic = this.generatePartitionsPerSubscribedTopic();
        const { memberAssignment } = await this.coordinator.syncGroup({
            groupId,
            generationId,
            memberId,
            groupAssignment: assignment,
        });
        const decodedMemberAssignment = MemberAssignment.decode(memberAssignment);
        const decodedAssignment = decodedMemberAssignment != null ? decodedMemberAssignment.assignment : {};
        this.logger.debug('Received assignment', {
            groupId,
            generationId,
            memberId,
            memberAssignment: decodedAssignment,
        });
        const assignedTopics = keys(decodedAssignment);
        const topicsNotSubscribed = arrayDiff(assignedTopics, topicsSubscribed);
        if (topicsNotSubscribed.length > 0) {
            const payload = {
                groupId,
                generationId,
                memberId,
                assignedTopics,
                topicsSubscribed,
                topicsNotSubscribed,
            };
            this.instrumentationEmitter.emit(RECEIVED_UNSUBSCRIBED_TOPICS, payload);
            this.logger.warn('Consumer group received unsubscribed topics', {
                ...payload,
                helpUrl: websiteUrl('docs/faq', 'why-am-i-receiving-messages-for-topics-i-m-not-subscribed-to'),
            });
        }
        // Remove unsubscribed topics from the list
        const safeAssignment = arrayDiff(assignedTopics, topicsNotSubscribed);
        const currentMemberAssignment = safeAssignment.map((topic: any) => ({
            topic,
            partitions: decodedAssignment[topic]
        }));
        // Check if the consumer is aware of all assigned partitions
        for (const assignment of currentMemberAssignment) {
            const { topic, partitions: assignedPartitions } = assignment;
            const knownPartitions = this.partitionsPerSubscribedTopic.get(topic);
            const isAwareOfAllAssignedPartitions = assignedPartitions.every((partition: any) => knownPartitions.includes(partition));
            if (!isAwareOfAllAssignedPartitions) {
                this.logger.warn('Consumer is not aware of all assigned partitions, refreshing metadata', {
                    groupId,
                    generationId,
                    memberId,
                    topic,
                    knownPartitions,
                    assignedPartitions,
                });
                // If the consumer is not aware of all assigned partitions, refresh metadata
                // and update the list of partitions per subscribed topic. It's enough to perform
                // this operation once since refresh metadata will update metadata for all topics
                await this.cluster.refreshMetadata();
                this.partitionsPerSubscribedTopic = this.generatePartitionsPerSubscribedTopic();
                break;
            }
        }
        this.topics = currentMemberAssignment.map(({ topic }: any) => topic);
        this.subscriptionState.assign(currentMemberAssignment);
        this.offsetManager = new OffsetManager({
            cluster: this.cluster,
            topicConfigurations: this.topicConfigurations,
            instrumentationEmitter: this.instrumentationEmitter,
            // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'partitionsByTopic' implicitly has an 'a... Remove this comment to see the full error message
            memberAssignment: currentMemberAssignment.reduce((partitionsByTopic, { topic, partitions }: any) => ({
                ...partitionsByTopic,
                [topic]: partitions
            }), {}),
            autoCommit: this.autoCommit,
            autoCommitInterval: this.autoCommitInterval,
            autoCommitThreshold: this.autoCommitThreshold,
            coordinator,
            groupId,
            generationId,
            memberId,
        });
    }
    joinAndSync() {
        const startJoin = Date.now();
        // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
        return this.retrier(async (bail: any) => {
            try {
                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                await this[PRIVATE.JOIN]();
                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                await this[PRIVATE.SYNC]();
                // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'result' implicitly has an 'any' type.
                const memberAssignment = this.assigned().reduce((result, { topic, partitions }: any) => ({
                    ...result,
                    [topic]: partitions
                }), {});
                const payload = {
                    groupId: this.groupId,
                    memberId: this.memberId,
                    leaderId: this.leaderId,
                    isLeader: this.isLeader(),
                    memberAssignment,
                    groupProtocol: this.groupProtocol,
                    duration: Date.now() - startJoin,
                };
                this.instrumentationEmitter.emit(GROUP_JOIN, payload);
                this.logger.info('Consumer has joined the group', payload);
            }
            catch (e) {
                if (isRebalancing(e)) {
                    // Rebalance in progress isn't a retriable protocol error since the consumer
                    // has to go through find coordinator and join again before it can
                    // actually retry the operation. We wrap the original error in a retriable error
                    // here instead in order to restart the join + sync sequence using the retrier.
                    throw new KafkaJSError(e);
                }
                bail(e);
            }
        });
    }
    /**
     * @param {import("../../types").TopicPartition} topicPartition
     */
    resetOffset({ topic, partition }: any) {
        this.offsetManager.resetOffset({ topic, partition });
    }
    /**
     * @param {import("../../types").TopicPartitionOffset} topicPartitionOffset
     */
    resolveOffset({ topic, partition, offset }: any) {
        this.offsetManager.resolveOffset({ topic, partition, offset });
    }
    /**
     * Update the consumer offset for the given topic/partition. This will be used
     * on the next fetch. If this API is invoked for the same topic/partition more
     * than once, the latest offset will be used on the next fetch.
     *
     * @param {import("../../types").TopicPartitionOffset} topicPartitionOffset
     */
    seek({ topic, partition, offset }: any) {
        this.seekOffset.set(topic, partition, offset);
    }
    pause(topicPartitions: any) {
        this.logger.info(`Pausing fetching from ${topicPartitions.length} topics`, {
            topicPartitions,
        });
        this.subscriptionState.pause(topicPartitions);
    }
    resume(topicPartitions: any) {
        this.logger.info(`Resuming fetching from ${topicPartitions.length} topics`, {
            topicPartitions,
        });
        this.subscriptionState.resume(topicPartitions);
    }
    assigned() {
        return this.subscriptionState.assigned();
    }
    paused() {
        return this.subscriptionState.paused();
    }
    async commitOffsetsIfNecessary() {
        await this.offsetManager.commitOffsetsIfNecessary();
    }
    async commitOffsets(offsets: any) {
        await this.offsetManager.commitOffsets(offsets);
    }
    uncommittedOffsets() {
        return this.offsetManager.uncommittedOffsets();
    }
    async heartbeat({ interval }: any) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        return this[PRIVATE.SHAREDHEARTBEAT]({ interval });
    }
    async fetch() {
        try {
            const { topics, maxBytesPerPartition, maxWaitTime, minBytes, maxBytes } = this;
            /** @type {{[nodeId: string]: {topic: string, partitions: { partition: number; fetchOffset: string; maxBytes: number }[]}[]}} */
            const requestsPerNode = {};
            await this.cluster.refreshMetadataIfNecessary();
            this.checkForStaleAssignment();
            while (this.seekOffset.size > 0) {
                const seekEntry = this.seekOffset.pop();
                this.logger.debug('Seek offset', {
                    groupId: this.groupId,
                    memberId: this.memberId,
                    seek: seekEntry,
                });
                await this.offsetManager.seek(seekEntry);
            }
            const pausedTopicPartitions = this.subscriptionState.paused();
            const activeTopicPartitions = this.subscriptionState.active();
            const activePartitions = flatten(activeTopicPartitions.map(({ partitions }: any) => partitions));
            const activeTopics = activeTopicPartitions
                .filter(({ partitions }: any) => partitions.length > 0)
                .map(({ topic }: any) => topic);
            if (activePartitions.length === 0) {
                this.logger.debug(`No active topic partitions, sleeping for ${this.maxWaitTime}ms`, {
                    topics,
                    activeTopicPartitions,
                    pausedTopicPartitions,
                });
                await sleep(this.maxWaitTime);
                return BufferedAsyncIterator([]);
            }
            await this.offsetManager.resolveOffsets();
            this.logger.debug(`Fetching from ${activePartitions.length} partitions for ${activeTopics.length} out of ${topics.length} topics`, {
                topics,
                activeTopicPartitions,
                pausedTopicPartitions,
            });
            for (const topicPartition of activeTopicPartitions) {
                const partitionsPerNode = this.findReadReplicaForPartitions(topicPartition.topic, topicPartition.partitions);
                const nodeIds = keys(partitionsPerNode);
                const committedOffsets = this.offsetManager.committedOffsets();
                for (const nodeId of nodeIds) {
                    const partitions = partitionsPerNode[nodeId]
                        .filter((partition: any) => {
                        /**
                         * When recovering from OffsetOutOfRange, each partition can recover
                         * concurrently, which invalidates resolved and committed offsets as part
                         * of the recovery mechanism (see OffsetManager.clearOffsets). In concurrent
                         * scenarios this can initiate a new fetch with invalid offsets.
                         *
                         * This was further highlighted by https://github.com/tulios/kafkajs/pull/570,
                         * which increased concurrency, making this more likely to happen.
                         *
                         * This is solved by only making requests for partitions with initialized offsets.
                         *
                         * See the following pull request which explains the context of the problem:
                         * @issue https://github.com/tulios/kafkajs/pull/578
                         */
                        return committedOffsets[topicPartition.topic][partition] != null;
                    })
                        .map((partition: any) => ({
                        partition,
                        fetchOffset: this.offsetManager
                            .nextOffset(topicPartition.topic, partition)
                            .toString(),
                        maxBytes: maxBytesPerPartition
                    }));
                    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    requestsPerNode[nodeId] = requestsPerNode[nodeId] || [];
                    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    requestsPerNode[nodeId].push({ topic: topicPartition.topic, partitions });
                }
            }
            const requests = keys(requestsPerNode).map(async (nodeId) => {
                const broker = await this.cluster.findBroker({ nodeId });
                const { responses } = await broker.fetch({
                    maxWaitTime,
                    minBytes,
                    maxBytes,
                    isolationLevel: this.isolationLevel,
                    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    topics: requestsPerNode[nodeId],
                    rackId: this.rackId,
                });
                const batchesPerPartition = responses.map(({ topicName, partitions }: any) => {
                    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    const topicRequestData = requestsPerNode[nodeId].find(({ topic }: any) => topic === topicName);
                    let preferredReadReplicas = this.preferredReadReplicasPerTopicPartition[topicName];
                    if (!preferredReadReplicas) {
                        this.preferredReadReplicasPerTopicPartition[topicName] = preferredReadReplicas = {};
                    }
                    return partitions
                        .filter((partitionData: any) => !this.seekOffset.has(topicName, partitionData.partition) &&
                        !this.subscriptionState.isPaused(topicName, partitionData.partition))
                        .map((partitionData: any) => {
                        const { partition, preferredReadReplica } = partitionData;
                        if (preferredReadReplica != null && preferredReadReplica !== -1) {
                            const { nodeId: currentPreferredReadReplica } = preferredReadReplicas[partition] || {};
                            if (currentPreferredReadReplica !== preferredReadReplica) {
                                this.logger.info(`Preferred read replica is now ${preferredReadReplica}`, {
                                    groupId: this.groupId,
                                    memberId: this.memberId,
                                    topic: topicName,
                                    partition,
                                });
                            }
                            preferredReadReplicas[partition] = {
                                nodeId: preferredReadReplica,
                                expireAt: Date.now() + this.metadataMaxAge,
                            };
                        }
                        const partitionRequestData = topicRequestData.partitions.find(({ partition }: any) => partition === partitionData.partition);
                        const fetchedOffset = partitionRequestData.fetchOffset;
                        const batch = new Batch(topicName, fetchedOffset, partitionData);
                        /**
                         * Resolve the offset to skip the control batch since `eachBatch` or `eachMessage` callbacks
                         * won't process empty batches
                         *
                         * @see https://github.com/apache/kafka/blob/9aa660786e46c1efbf5605a6a69136a1dac6edb9/clients/src/main/java/org/apache/kafka/clients/consumer/internals/Fetcher.java#L1499-L1505
                         */
                        if (batch.isEmptyControlRecord() || batch.isEmptyDueToLogCompactedMessages()) {
                            this.resolveOffset({
                                topic: batch.topic,
                                partition: batch.partition,
                                offset: batch.lastOffset(),
                            });
                        }
                        return batch;
                    });
                });
                return flatten(batchesPerPartition);
            });
            // fetch can generate empty requests when the consumer group receives an assignment
            // with more topics than the subscribed, so to prevent a busy loop we wait the
            // configured max wait time
            if (requests.length === 0) {
                await sleep(this.maxWaitTime);
                return BufferedAsyncIterator([]);
            }
            return BufferedAsyncIterator(requests, (e: any) => this.recoverFromFetch(e));
        }
        catch (e) {
            await this.recoverFromFetch(e);
        }
    }
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    async recoverFromFetch(e: any) {
        // @ts-expect-error ts-migrate(2550) FIXME: Property 'includes' does not exist on type 'any[]'... Remove this comment to see the full error message
        if (STALE_METADATA_ERRORS.includes(e.type) || e.name === 'KafkaJSTopicMetadataNotLoaded') {
            this.logger.debug('Stale cluster metadata, refreshing...', {
                groupId: this.groupId,
                memberId: this.memberId,
                error: e.message,
            });
            await this.cluster.refreshMetadata();
            await this.joinAndSync();
            throw new KafkaJSError(e.message);
        }
        if (e.name === 'KafkaJSStaleTopicMetadataAssignment') {
            this.logger.warn(`${e.message}, resync group`, {
                groupId: this.groupId,
                memberId: this.memberId,
                topic: e.topic,
                unknownPartitions: e.unknownPartitions,
            });
            await this.joinAndSync();
        }
        if (e.name === 'KafkaJSOffsetOutOfRange') {
            await this.recoverFromOffsetOutOfRange(e);
        }
        if (e.name === 'KafkaJSConnectionClosedError') {
            this.cluster.removeBroker({ host: e.host, port: e.port });
        }
        if (e.name === 'KafkaJSBrokerNotFound' || e.name === 'KafkaJSConnectionClosedError') {
            this.logger.debug(`${e.message}, refreshing metadata and retrying...`);
            await this.cluster.refreshMetadata();
        }
        throw e;
    }
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    async recoverFromOffsetOutOfRange(e: any) {
        // If we are fetching from a follower try with the leader before resetting offsets
        const preferredReadReplicas = this.preferredReadReplicasPerTopicPartition[e.topic];
        if (preferredReadReplicas && typeof preferredReadReplicas[e.partition] === 'number') {
            this.logger.info('Offset out of range while fetching from follower, retrying with leader', {
                topic: e.topic,
                partition: e.partition,
                groupId: this.groupId,
                memberId: this.memberId,
            });
            delete preferredReadReplicas[e.partition];
        }
        else {
            this.logger.error('Offset out of range, resetting to default offset', {
                topic: e.topic,
                partition: e.partition,
                groupId: this.groupId,
                memberId: this.memberId,
            });
            await this.offsetManager.setDefaultOffset({
                topic: e.topic,
                partition: e.partition,
            });
        }
    }
    generatePartitionsPerSubscribedTopic() {
        // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Map'. Do you need to change your... Remove this comment to see the full error message
        const map = new Map();
        for (const topic of this.topicsSubscribed) {
            const partitions = this.cluster
                .findTopicPartitionMetadata(topic)
                .map((m: any) => m.partitionId)
                .sort();
            map.set(topic, partitions);
        }
        return map;
    }
    checkForStaleAssignment() {
        if (!this.partitionsPerSubscribedTopic) {
            return;
        }
        const newPartitionsPerSubscribedTopic = this.generatePartitionsPerSubscribedTopic();
        for (const [topic, partitions] of newPartitionsPerSubscribedTopic) {
            const diff = arrayDiff(partitions, this.partitionsPerSubscribedTopic.get(topic));
            if (diff.length > 0) {
                throw new KafkaJSStaleTopicMetadataAssignment('Topic has been updated', {
                    topic,
                    unknownPartitions: diff,
                });
            }
        }
    }
    hasSeekOffset({ topic, partition }: any) {
        return this.seekOffset.has(topic, partition);
    }
    /**
     * For each of the partitions find the best nodeId to read it from
     *
     * @param {string} topic
     * @param {number[]} partitions
     * @returns {{[nodeId: number]: number[]}} per-node assignment of partitions
     * @see Cluster~findLeaderForPartitions
     */
    // Invariant: The resulting object has each partition referenced exactly once
    findReadReplicaForPartitions(topic: any, partitions: any) {
        const partitionMetadata = this.cluster.findTopicPartitionMetadata(topic);
        const preferredReadReplicas = this.preferredReadReplicasPerTopicPartition[topic];
        return partitions.reduce((result: any, id: any) => {
            const partitionId = parseInt(id, 10);
            const metadata = partitionMetadata.find((p: any) => p.partitionId === partitionId);
            if (!metadata) {
                return result;
            }
            if (metadata.leader == null) {
                // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ topic: any; partitionId: numbe... Remove this comment to see the full error message
                throw new KafkaJSError('Invalid partition metadata', { topic, partitionId, metadata });
            }
            // Pick the preferred replica if there is one, and it isn't known to be offline, otherwise the leader.
            let nodeId = metadata.leader;
            if (preferredReadReplicas) {
                const { nodeId: preferredReadReplica, expireAt } = preferredReadReplicas[partitionId] || {};
                if (Date.now() >= expireAt) {
                    this.logger.debug('Preferred read replica information has expired, using leader', {
                        topic,
                        partitionId,
                        groupId: this.groupId,
                        memberId: this.memberId,
                        preferredReadReplica,
                        leader: metadata.leader,
                    });
                    // Drop the entry
                    delete preferredReadReplicas[partitionId];
                }
                else if (preferredReadReplica != null) {
                    // Valid entry, check whether it is not offline
                    // Note that we don't delete the preference here, and rather hope that eventually that replica comes online again
                    const offlineReplicas = metadata.offlineReplicas;
                    // @ts-expect-error ts-migrate(2550) FIXME: Property 'includes' does not exist on type 'any[]'... Remove this comment to see the full error message
                    if (Array.isArray(offlineReplicas) && offlineReplicas.includes(nodeId)) {
                        this.logger.debug('Preferred read replica is offline, using leader', {
                            topic,
                            partitionId,
                            groupId: this.groupId,
                            memberId: this.memberId,
                            preferredReadReplica,
                            leader: metadata.leader,
                        });
                    }
                    else {
                        nodeId = preferredReadReplica;
                    }
                }
            }
            const current = result[nodeId] || [];
            return { ...result, [nodeId]: [...current, partitionId] };
        }, {});
    }
};

    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    this[(PRIVATE as any).SHAREDHEARTBEAT] = sharedPromiseTo(async ({ interval }: any) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'groupId' does not exist on type 'typeof ... Remove this comment to see the full error message
    const { groupId, generationId, memberId } = this;
    const now = Date.now();
    // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
    if (memberId && now >= this.lastRequest + interval) {
        const payload = {
            groupId,
            memberId,
            groupGenerationId: generationId,
        };
        // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
        await this.coordinator.heartbeat(payload);
        // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
        this.instrumentationEmitter.emit(HEARTBEAT, payload);
        // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
        this.lastRequest = Date.now();
    }
});
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'isLeader'.
  isLeader() {
    return this.leaderId && this.memberId === this.leaderId
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'async'.
  async connect() {
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    await this.cluster.connect()
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.instrumentationEmitter.emit(CONNECT)
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    await this.cluster.refreshMetadataIfNecessary()
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'async'.
  async [PRIVATE.JOIN]() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'groupId' does not exist on type 'typeof ... Remove this comment to see the full error message
    const { groupId, sessionTimeout, rebalanceTimeout } = this

    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.coordinator = await this.cluster.findGroupCoordinator({ groupId })

    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    const groupData = await this.coordinator.joinGroup({
      groupId,
      sessionTimeout,
      rebalanceTimeout,
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      memberId: this.memberId || '',
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      groupProtocols: this.assigners.map((assigner: any) => assigner.protocol({
        // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
        topics: this.topicsSubscribed,
      })
      ),
    })

    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.generationId = groupData.generationId
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.leaderId = groupData.leaderId
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.memberId = groupData.memberId
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.members = groupData.members
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.groupProtocol = groupData.groupProtocol
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'async'.
  async leave() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'groupId' does not exist on type 'typeof ... Remove this comment to see the full error message
    const { groupId, memberId } = this
    if (memberId) {
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      await this.coordinator.leaveGroup({ groupId, memberId })
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      this.memberId = null
    }
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'async'.
  async [PRIVATE.SYNC]() {
    let assignment = []
    const {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'groupId' does not exist on type 'typeof ... Remove this comment to see the full error message
      groupId,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'generationId' does not exist on type 'ty... Remove this comment to see the full error message
      generationId,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'memberId' does not exist on type 'typeof... Remove this comment to see the full error message
      memberId,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'members' does not exist on type 'typeof ... Remove this comment to see the full error message
      members,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'groupProtocol' does not exist on type 't... Remove this comment to see the full error message
      groupProtocol,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'topics' does not exist on type 'typeof g... Remove this comment to see the full error message
      topics,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'topicsSubscribed' does not exist on type... Remove this comment to see the full error message
      topicsSubscribed,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'coordinator' does not exist on type 'typ... Remove this comment to see the full error message
      coordinator,
    } = this

    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    if (this.isLeader()) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'logger' does not exist on type 'typeof g... Remove this comment to see the full error message
      this.logger.debug('Chosen as group leader', { groupId, generationId, memberId, topics })
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      const assigner = this.assigners.find(({
        name
      }: any) => name === groupProtocol)

      if (!assigner) {
        throw new KafkaJSNonRetriableError(
          `Unsupported partition assigner "${groupProtocol}", the assigner wasn't found in the assigners list`
        )
      }

      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      await this.cluster.refreshMetadata()
      assignment = await assigner.assign({ members, topics: topicsSubscribed })

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'logger' does not exist on type 'typeof g... Remove this comment to see the full error message
      this.logger.debug('Group assignment', {
        groupId,
        generationId,
        groupProtocol,
        assignment,
        topics: topicsSubscribed,
      })
    }

    // Keep track of the partitions for the subscribed topics
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.partitionsPerSubscribedTopic = this.generatePartitionsPerSubscribedTopic()
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    const { memberAssignment } = await this.coordinator.syncGroup({
      groupId,
      generationId,
      memberId,
      groupAssignment: assignment,
    })

    const decodedMemberAssignment = MemberAssignment.decode(memberAssignment)
    const decodedAssignment =
      decodedMemberAssignment != null ? decodedMemberAssignment.assignment : {}

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'logger' does not exist on type 'typeof g... Remove this comment to see the full error message
    this.logger.debug('Received assignment', {
      groupId,
      generationId,
      memberId,
      memberAssignment: decodedAssignment,
    })

    const assignedTopics = keys(decodedAssignment)
    const topicsNotSubscribed = arrayDiff(assignedTopics, topicsSubscribed)

    if (topicsNotSubscribed.length > 0) {
      const payload = {
        groupId,
        generationId,
        memberId,
        assignedTopics,
        topicsSubscribed,
        topicsNotSubscribed,
      }

      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      this.instrumentationEmitter.emit(RECEIVED_UNSUBSCRIBED_TOPICS, payload)
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'logger' does not exist on type 'typeof g... Remove this comment to see the full error message
      this.logger.warn('Consumer group received unsubscribed topics', {
        ...payload,
        helpUrl: websiteUrl(
          'docs/faq',
          'why-am-i-receiving-messages-for-topics-i-m-not-subscribed-to'
        ),
      })
    }

    // Remove unsubscribed topics from the list
    const safeAssignment = arrayDiff(assignedTopics, topicsNotSubscribed)
    const currentMemberAssignment = safeAssignment.map((topic: any) => ({
      topic,
      partitions: decodedAssignment[topic]
    }))

    // Check if the consumer is aware of all assigned partitions
    for (const assignment of currentMemberAssignment) {
      const { topic, partitions: assignedPartitions } = assignment
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      const knownPartitions = this.partitionsPerSubscribedTopic.get(topic)
      const isAwareOfAllAssignedPartitions = assignedPartitions.every((partition: any) => knownPartitions.includes(partition)
      )

      if (!isAwareOfAllAssignedPartitions) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'logger' does not exist on type 'typeof g... Remove this comment to see the full error message
        this.logger.warn('Consumer is not aware of all assigned partitions, refreshing metadata', {
          groupId,
          generationId,
          memberId,
          topic,
          knownPartitions,
          assignedPartitions,
        })

        // If the consumer is not aware of all assigned partitions, refresh metadata
        // and update the list of partitions per subscribed topic. It's enough to perform
        // this operation once since refresh metadata will update metadata for all topics
        // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        await this.cluster.refreshMetadata()
        // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        this.partitionsPerSubscribedTopic = this.generatePartitionsPerSubscribedTopic()
        break
      }
    }

    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.topics = currentMemberAssignment.map(({
      topic
    }: any) => topic)
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.subscriptionState.assign(currentMemberAssignment)
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.offsetManager = new OffsetManager({
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      cluster: this.cluster,
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      topicConfigurations: this.topicConfigurations,
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      instrumentationEmitter: this.instrumentationEmitter,
      memberAssignment: currentMemberAssignment.reduce(
        (
          // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'partitionsByTopic' implicitly has an 'a... Remove this comment to see the full error message
          partitionsByTopic,
          {
            topic,
            partitions
          }: any
        ) => ({
          ...partitionsByTopic,
          [topic]: partitions
        }),
        {}
      ),
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      autoCommit: this.autoCommit,
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      autoCommitInterval: this.autoCommitInterval,
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      autoCommitThreshold: this.autoCommitThreshold,
      coordinator,
      groupId,
      generationId,
      memberId,
    })
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'joinAndSync'.
  joinAndSync() {
    const startJoin = Date.now()
    return this.retrier(async (bail: any) => {
      try {
        await this[(PRIVATE as any).JOIN]();
        await this[(PRIVATE as any).SYNC]();

        const memberAssignment = this.assigned().reduce(
          (
            result,
            {
              topic,
              partitions
            }: any
          ) => ({
            ...result,
            [topic]: partitions
          }),
          {}
        )

        const payload = {
          groupId: this.groupId,
          memberId: this.memberId,
          leaderId: this.leaderId,
          isLeader: this.isLeader(),
          memberAssignment,
          groupProtocol: this.groupProtocol,
          duration: Date.now() - startJoin,
        }

        this.instrumentationEmitter.emit(GROUP_JOIN, payload)
        this.logger.info('Consumer has joined the group', payload)
      } catch (e) {
        if (isRebalancing(e)) {
          // Rebalance in progress isn't a retriable protocol error since the consumer
          // has to go through find coordinator and join again before it can
          // actually retry the operation. We wrap the original error in a retriable error
          // here instead in order to restart the join + sync sequence using the retrier.
          throw new KafkaJSError(e)
        }

        bail(e)
      }
    });
  }

  /**
   * @param {import("../../types").TopicPartition} topicPartition
   */
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'resetOffset'.
  resetOffset({
    topic,
    partition
  // @ts-expect-error ts-migrate(2693) FIXME: 'any' only refers to a type, but is being used as ... Remove this comment to see the full error message
  }: any) {
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.offsetManager.resetOffset({ topic, partition })
  }

  /**
   * @param {import("../../types").TopicPartitionOffset} topicPartitionOffset
   */
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'resolveOffset'.
  resolveOffset({
    topic,
    partition,
    // @ts-expect-error ts-migrate(18004) FIXME: No value exists in scope for the shorthand propert... Remove this comment to see the full error message
    offset
  // @ts-expect-error ts-migrate(2693) FIXME: 'any' only refers to a type, but is being used as ... Remove this comment to see the full error message
  }: any) {
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.offsetManager.resolveOffset({ topic, partition, offset })
  }

  /**
   * Update the consumer offset for the given topic/partition. This will be used
   * on the next fetch. If this API is invoked for the same topic/partition more
   * than once, the latest offset will be used on the next fetch.
   *
   * @param {import("../../types").TopicPartitionOffset} topicPartitionOffset
   */
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'seek'.
  seek({
    topic,
    partition,
    // @ts-expect-error ts-migrate(18004) FIXME: No value exists in scope for the shorthand propert... Remove this comment to see the full error message
    offset
  // @ts-expect-error ts-migrate(2693) FIXME: 'any' only refers to a type, but is being used as ... Remove this comment to see the full error message
  }: any) {
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.seekOffset.set(topic, partition, offset)
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'pause'.
  pause(topicPartitions: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'logger' does not exist on type 'typeof g... Remove this comment to see the full error message
    this.logger.info(`Pausing fetching from ${topicPartitions.length} topics`, {
      // @ts-expect-error ts-migrate(18004) FIXME: No value exists in scope for the shorthand propert... Remove this comment to see the full error message
      topicPartitions,
    })
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.subscriptionState.pause(topicPartitions)
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'resume'.
  resume(topicPartitions: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'logger' does not exist on type 'typeof g... Remove this comment to see the full error message
    this.logger.info(`Resuming fetching from ${topicPartitions.length} topics`, {
      // @ts-expect-error ts-migrate(18004) FIXME: No value exists in scope for the shorthand propert... Remove this comment to see the full error message
      topicPartitions,
    })
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this.subscriptionState.resume(topicPartitions)
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'assigned'.
  assigned() {
    return this.subscriptionState.assigned()
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'paused'.
  paused() {
    return this.subscriptionState.paused()
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'async'.
  async commitOffsetsIfNecessary() {
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    await this.offsetManager.commitOffsetsIfNecessary()
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'async'.
  async commitOffsets(offsets: any) {
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    await this.offsetManager.commitOffsets(offsets)
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'uncommittedOffsets'.
  uncommittedOffsets() {
    return this.offsetManager.uncommittedOffsets()
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'async'.
  async heartbeat({
    // @ts-expect-error ts-migrate(18004) FIXME: No value exists in scope for the shorthand propert... Remove this comment to see the full error message
    interval
  // @ts-expect-error ts-migrate(2693) FIXME: 'any' only refers to a type, but is being used as ... Remove this comment to see the full error message
  }: any) {
    return this[(PRIVATE as any).SHAREDHEARTBEAT]({ interval });
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'async'.
  async fetch() {
    try {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'topics' does not exist on type 'typeof g... Remove this comment to see the full error message
      const { topics, maxBytesPerPartition, maxWaitTime, minBytes, maxBytes } = this
      /** @type {{[nodeId: string]: {topic: string, partitions: { partition: number; fetchOffset: string; maxBytes: number }[]}[]}} */
      const requestsPerNode = {}

      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      await this.cluster.refreshMetadataIfNecessary()
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      this.checkForStaleAssignment()

      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      while (this.seekOffset.size > 0) {
        // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        const seekEntry = this.seekOffset.pop()
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'logger' does not exist on type 'typeof g... Remove this comment to see the full error message
        this.logger.debug('Seek offset', {
          // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
          groupId: this.groupId,
          // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
          memberId: this.memberId,
          seek: seekEntry,
        })
        // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        await this.offsetManager.seek(seekEntry)
      }

      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      const pausedTopicPartitions = this.subscriptionState.paused()
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      const activeTopicPartitions = this.subscriptionState.active()

      const activePartitions = flatten(activeTopicPartitions.map(({
        partitions
      }: any) => partitions))
      const activeTopics = activeTopicPartitions
        .filter(({
        partitions
      }: any) => partitions.length > 0)
        .map(({
        topic
      }: any) => topic)

      if (activePartitions.length === 0) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'logger' does not exist on type 'typeof g... Remove this comment to see the full error message
        this.logger.debug(`No active topic partitions, sleeping for ${this.maxWaitTime}ms`, {
          topics,
          activeTopicPartitions,
          pausedTopicPartitions,
        })

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'maxWaitTime' does not exist on type 'typ... Remove this comment to see the full error message
        await sleep(this.maxWaitTime)
        return BufferedAsyncIterator([])
      }

      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      await this.offsetManager.resolveOffsets()

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'logger' does not exist on type 'typeof g... Remove this comment to see the full error message
      this.logger.debug(
        `Fetching from ${activePartitions.length} partitions for ${activeTopics.length} out of ${topics.length} topics`,
        {
          topics,
          activeTopicPartitions,
          pausedTopicPartitions,
        }
      )

      for (const topicPartition of activeTopicPartitions) {
        // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        const partitionsPerNode = this.findReadReplicaForPartitions(
          topicPartition.topic,
          topicPartition.partitions
        )

        const nodeIds = keys(partitionsPerNode)
        // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        const committedOffsets = this.offsetManager.committedOffsets()

        for (const nodeId of nodeIds) {
          const partitions = partitionsPerNode[nodeId]
            .filter((partition: any) => {
              /**
               * When recovering from OffsetOutOfRange, each partition can recover
               * concurrently, which invalidates resolved and committed offsets as part
               * of the recovery mechanism (see OffsetManager.clearOffsets). In concurrent
               * scenarios this can initiate a new fetch with invalid offsets.
               *
               * This was further highlighted by https://github.com/tulios/kafkajs/pull/570,
               * which increased concurrency, making this more likely to happen.
               *
               * This is solved by only making requests for partitions with initialized offsets.
               *
               * See the following pull request which explains the context of the problem:
               * @issue https://github.com/tulios/kafkajs/pull/578
               */
              return committedOffsets[topicPartition.topic][partition] != null
            })
            .map((partition: any) => ({
            partition,

            // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
            fetchOffset: this.offsetManager
              .nextOffset(topicPartition.topic, partition)
              .toString(),

            maxBytes: maxBytesPerPartition
          }))

          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          requestsPerNode[nodeId] = requestsPerNode[nodeId] || []
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          requestsPerNode[nodeId].push({ topic: topicPartition.topic, partitions })
        }
      }

      const requests = keys(requestsPerNode).map(async nodeId => {
        // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
        const broker = await this.cluster.findBroker({ nodeId })
        const { responses } = await broker.fetch({
          maxWaitTime,
          minBytes,
          maxBytes,
          // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
          isolationLevel: this.isolationLevel,
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          topics: requestsPerNode[nodeId],
          // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
          rackId: this.rackId,
        })

        const batchesPerPartition = responses.map(({
          topicName,
          partitions
        }: any) => {
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          const topicRequestData = requestsPerNode[nodeId].find(({
            topic
          }: any) => topic === topicName)
          // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
          let preferredReadReplicas = this.preferredReadReplicasPerTopicPartition[topicName]
          if (!preferredReadReplicas) {
            // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
            this.preferredReadReplicasPerTopicPartition[topicName] = preferredReadReplicas = {}
          }

          return partitions
            .filter(
              // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
              (partitionData: any) => !this.seekOffset.has(topicName, partitionData.partition) &&
              // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
              !this.subscriptionState.isPaused(topicName, partitionData.partition)
            )
            .map((partitionData: any) => {
              const { partition, preferredReadReplica } = partitionData
              if (preferredReadReplica != null && preferredReadReplica !== -1) {
                const { nodeId: currentPreferredReadReplica } =
                  preferredReadReplicas[partition] || {}
                if (currentPreferredReadReplica !== preferredReadReplica) {
                  // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
                  this.logger.info(`Preferred read replica is now ${preferredReadReplica}`, {
                    // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
                    groupId: this.groupId,
                    // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
                    memberId: this.memberId,
                    topic: topicName,
                    partition,
                  })
                }
                preferredReadReplicas[partition] = {
                  nodeId: preferredReadReplica,
                  // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
                  expireAt: Date.now() + this.metadataMaxAge,
                }
              }

              const partitionRequestData = topicRequestData.partitions.find(
                ({
                  partition
                }: any) => partition === partitionData.partition
              )

              const fetchedOffset = partitionRequestData.fetchOffset
              const batch = new Batch(topicName, fetchedOffset, partitionData)

              /**
               * Resolve the offset to skip the control batch since `eachBatch` or `eachMessage` callbacks
               * won't process empty batches
               *
               * @see https://github.com/apache/kafka/blob/9aa660786e46c1efbf5605a6a69136a1dac6edb9/clients/src/main/java/org/apache/kafka/clients/consumer/internals/Fetcher.java#L1499-L1505
               */
              if (batch.isEmptyControlRecord() || batch.isEmptyDueToLogCompactedMessages()) {
                // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
                this.resolveOffset({
                  topic: batch.topic,
                  partition: batch.partition,
                  offset: batch.lastOffset(),
                })
              }

              return batch
            });
        })

        return flatten(batchesPerPartition)
      })

      // fetch can generate empty requests when the consumer group receives an assignment
      // with more topics than the subscribed, so to prevent a busy loop we wait the
      // configured max wait time
      if (requests.length === 0) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'maxWaitTime' does not exist on type 'typ... Remove this comment to see the full error message
        await sleep(this.maxWaitTime)
        return BufferedAsyncIterator([])
      }

      return BufferedAsyncIterator(requests, (e: any) => this.recoverFromFetch(e));
    } catch (e) {
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      await this.recoverFromFetch(e)
    }
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'async'.
  async recoverFromFetch(e: any) {
    // @ts-expect-error ts-migrate(2550) FIXME: Property 'includes' does not exist on type 'any[]'... Remove this comment to see the full error message
    if (STALE_METADATA_ERRORS.includes(e.type) || e.name === 'KafkaJSTopicMetadataNotLoaded') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'logger' does not exist on type 'typeof g... Remove this comment to see the full error message
      this.logger.debug('Stale cluster metadata, refreshing...', {
        // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        groupId: this.groupId,
        // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        memberId: this.memberId,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'e'.
        error: e.message,
      })

      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      await this.cluster.refreshMetadata()
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      await this.joinAndSync()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'e'.
      throw new KafkaJSError(e.message)
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'e'.
    if (e.name === 'KafkaJSStaleTopicMetadataAssignment') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'logger' does not exist on type 'typeof g... Remove this comment to see the full error message
      this.logger.warn(`${e.message}, resync group`, {
        // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        groupId: this.groupId,
        // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        memberId: this.memberId,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'e'.
        topic: e.topic,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'e'.
        unknownPartitions: e.unknownPartitions,
      })

      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      await this.joinAndSync()
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'e'.
    if (e.name === 'KafkaJSOffsetOutOfRange') {
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      await this.recoverFromOffsetOutOfRange(e)
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'e'.
    if (e.name === 'KafkaJSConnectionClosedError') {
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      this.cluster.removeBroker({ host: e.host, port: e.port })
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'e'.
    if (e.name === 'KafkaJSBrokerNotFound' || e.name === 'KafkaJSConnectionClosedError') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'logger' does not exist on type 'typeof g... Remove this comment to see the full error message
      this.logger.debug(`${e.message}, refreshing metadata and retrying...`)
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      await this.cluster.refreshMetadata()
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'e'.
    throw e
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'async'.
  async recoverFromOffsetOutOfRange(e: any) {
    // If we are fetching from a follower try with the leader before resetting offsets
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    const preferredReadReplicas = this.preferredReadReplicasPerTopicPartition[e.topic]
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'e'.
    if (preferredReadReplicas && typeof preferredReadReplicas[e.partition] === 'number') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'logger' does not exist on type 'typeof g... Remove this comment to see the full error message
      this.logger.info('Offset out of range while fetching from follower, retrying with leader', {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'e'.
        topic: e.topic,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'e'.
        partition: e.partition,
        // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        groupId: this.groupId,
        // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        memberId: this.memberId,
      })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'e'.
      delete preferredReadReplicas[e.partition]
    } else {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'logger' does not exist on type 'typeof g... Remove this comment to see the full error message
      this.logger.error('Offset out of range, resetting to default offset', {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'e'.
        topic: e.topic,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'e'.
        partition: e.partition,
        // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        groupId: this.groupId,
        // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        memberId: this.memberId,
      })

      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      await this.offsetManager.setDefaultOffset({
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'e'.
        topic: e.topic,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'e'.
        partition: e.partition,
      })
    }
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'generatePartitionsPerSubscribedT... Remove this comment to see the full error message
  generatePartitionsPerSubscribedTopic() {
    // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Map'. Do you need to change your... Remove this comment to see the full error message
    const map = new Map()

    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    for (const topic of this.topicsSubscribed) {
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      const partitions = this.cluster
        .findTopicPartitionMetadata(topic)
        .map((m: any) => m.partitionId)
        .sort()

      map.set(topic, partitions)
    }

    return map
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'checkForStaleAssignment'.
  checkForStaleAssignment() {
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    if (!this.partitionsPerSubscribedTopic) {
      return
    }

    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    const newPartitionsPerSubscribedTopic = this.generatePartitionsPerSubscribedTopic()

    for (const [topic, partitions] of newPartitionsPerSubscribedTopic) {
      // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
      const diff = arrayDiff(partitions, this.partitionsPerSubscribedTopic.get(topic))

      if (diff.length > 0) {
        throw new KafkaJSStaleTopicMetadataAssignment('Topic has been updated', {
          topic,
          unknownPartitions: diff,
        })
      }
    }
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'hasSeekOffset'.
  hasSeekOffset({
    topic,
    partition
  // @ts-expect-error ts-migrate(2693) FIXME: 'any' only refers to a type, but is being used as ... Remove this comment to see the full error message
  }: any) {
    return this.seekOffset.has(topic, partition)
  }

  /**
   * For each of the partitions find the best nodeId to read it from
   *
   * @param {string} topic
   * @param {number[]} partitions
   * @returns {{[nodeId: number]: number[]}} per-node assignment of partitions
   * @see Cluster~findLeaderForPartitions
   */
  // Invariant: The resulting object has each partition referenced exactly once
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'findReadReplicaForPartitions'.
  findReadReplicaForPartitions(topic: any, partitions: any) {
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    const partitionMetadata = this.cluster.findTopicPartitionMetadata(topic)
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    const preferredReadReplicas = this.preferredReadReplicasPerTopicPartition[topic]
    return partitions.reduce((result: any, id: any) => {
      const partitionId = parseInt(id, 10)
      const metadata = partitionMetadata.find((p: any) => p.partitionId === partitionId)
      if (!metadata) {
        return result
      }

      if (metadata.leader == null) {
        throw new KafkaJSError('Invalid partition metadata', { topic, partitionId, metadata })
      }

      // Pick the preferred replica if there is one, and it isn't known to be offline, otherwise the leader.
      let nodeId = metadata.leader
      if (preferredReadReplicas) {
        const { nodeId: preferredReadReplica, expireAt } = preferredReadReplicas[partitionId] || {}
        if (Date.now() >= expireAt) {
          this.logger.debug('Preferred read replica information has expired, using leader', {
            topic,
            partitionId,
            groupId: this.groupId,
            memberId: this.memberId,
            preferredReadReplica,
            leader: metadata.leader,
          })
          // Drop the entry
          delete preferredReadReplicas[partitionId]
        } else if (preferredReadReplica != null) {
          // Valid entry, check whether it is not offline
          // Note that we don't delete the preference here, and rather hope that eventually that replica comes online again
          const offlineReplicas = metadata.offlineReplicas
          if (Array.isArray(offlineReplicas) && offlineReplicas.includes(nodeId)) {
            this.logger.debug('Preferred read replica is offline, using leader', {
              topic,
              partitionId,
              groupId: this.groupId,
              memberId: this.memberId,
              preferredReadReplica,
              leader: metadata.leader,
            })
          } else {
            nodeId = preferredReadReplica
          }
        }
      }
      const current = result[nodeId] || []
      return { ...result, [nodeId]: [...current, partitionId] }
    }, {});
  }
}
