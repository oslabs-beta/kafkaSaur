// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'flatten'.
const flatten = require('../utils/flatten')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSMet... Remove this comment to see the full error message
const { KafkaJSMetadataNotLoaded } = require('../errors')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'staleMetad... Remove this comment to see the full error message
const { staleMetadata } = require('../protocol/error')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'groupMessa... Remove this comment to see the full error message
const groupMessagesPerPartition = require('./groupMessagesPerPartition')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTopi... Remove this comment to see the full error message
const createTopicData = require('./createTopicData')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const responseSerializer = require('./responseSerializer')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'keys'.
const { keys } = Object

/**
 * @param {Object} options
 * @param {import("../../types").Logger} options.logger
 * @param {import("../../types").Cluster} options.cluster
 * @param {ReturnType<import("../../types").ICustomPartitioner>} options.partitioner
 * @param {import("./eosManager").EosManager} options.eosManager
 * @param {import("../retry").Retrier} options.retrier
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  logger,
  cluster,
  partitioner,
  eosManager,
  retrier
}: any) => {
  return async ({
    acks,
    timeout,
    compression,
    topicMessages
  }: any) => {
    /** @type {Map<import("../../types").Broker, any[]>} */
    // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Map'. Do you need to change your... Remove this comment to see the full error message
    const responsePerBroker = new Map()

    /** @param {Map<import("../../types").Broker, any[]>} responsePerBroker */
    const createProducerRequests = async (responsePerBroker: any) => {
      // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Map'. Do you need to change your... Remove this comment to see the full error message
      const topicMetadata = new Map()

      await cluster.refreshMetadataIfNecessary()

      for (const { topic, messages } of topicMessages) {
        const partitionMetadata = cluster.findTopicPartitionMetadata(topic)

        if (partitionMetadata.length === 0) {
          logger.debug('Producing to topic without metadata', {
            topic,
            // @ts-expect-error ts-migrate(2550) FIXME: Property 'from' does not exist on type 'ArrayConst... Remove this comment to see the full error message
            targetTopics: Array.from(cluster.targetTopics),
          })

          // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
          throw new KafkaJSMetadataNotLoaded('Producing to topic without metadata')
        }

        const messagesPerPartition = groupMessagesPerPartition({
          topic,
          partitionMetadata,
          messages,
          partitioner,
        })

        const partitions = keys(messagesPerPartition)
        const sequencePerPartition = partitions.reduce((result, partition) => {
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          result[partition] = eosManager.getSequence(topic, partition)
          return result
        }, {})

        const partitionsPerLeader = cluster.findLeaderForPartitions(topic, partitions)
        const leaders = keys(partitionsPerLeader)

        topicMetadata.set(topic, {
          partitionsPerLeader,
          messagesPerPartition,
          sequencePerPartition,
        })

        for (const nodeId of leaders) {
          const broker = await cluster.findBroker({ nodeId })
          if (!responsePerBroker.has(broker)) {
            responsePerBroker.set(broker, null)
          }
        }
      }

      // @ts-expect-error ts-migrate(2550) FIXME: Property 'from' does not exist on type 'ArrayConst... Remove this comment to see the full error message
      const brokers = Array.from(responsePerBroker.keys())
      const brokersWithoutResponse = brokers.filter((broker: any) => !responsePerBroker.get(broker))

      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      return brokersWithoutResponse.map(async (broker: any) => {
        // @ts-expect-error ts-migrate(2550) FIXME: Property 'from' does not exist on type 'ArrayConst... Remove this comment to see the full error message
        const entries = Array.from(topicMetadata.entries())
        const topicDataForBroker = entries
          // @ts-expect-error ts-migrate(7031) FIXME: Binding element '_' implicitly has an 'any' type.
          .filter(([_, {
          // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'partitionsPerLeader' implicitly h... Remove this comment to see the full error message
          partitionsPerLeader
        // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'any' implicitly has an 'any' type... Remove this comment to see the full error message
        }: any]) => !!partitionsPerLeader[broker.nodeId])
          // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'topic' implicitly has an 'any' ty... Remove this comment to see the full error message
          .map(([topic, {
          // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'partitionsPerLeader' implicitly h... Remove this comment to see the full error message
          partitionsPerLeader,
          // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'messagesPerPartition' implicitly ... Remove this comment to see the full error message
          messagesPerPartition,
          // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'sequencePerPartition' implicitly ... Remove this comment to see the full error message
          sequencePerPartition
        // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'any' implicitly has an 'any' type... Remove this comment to see the full error message
        }: any]) => ({
            topic,
            partitions: partitionsPerLeader[broker.nodeId],
            sequencePerPartition,
            messagesPerPartition,
          }))

        const topicData = createTopicData(topicDataForBroker)

        try {
          if (eosManager.isTransactional()) {
            await eosManager.addPartitionsToTransaction(topicData)
          }

          const response = await broker.produce({
            transactionalId: eosManager.isTransactional()
              ? eosManager.getTransactionalId()
              : undefined,
            producerId: eosManager.getProducerId(),
            producerEpoch: eosManager.getProducerEpoch(),
            acks,
            timeout,
            compression,
            topicData,
          })

          const expectResponse = acks !== 0
          const formattedResponse = expectResponse ? responseSerializer(response) : []

          formattedResponse.forEach(({
            topicName,
            partition
          }: any) => {
            const increment = topicMetadata.get(topicName).messagesPerPartition[partition].length

            eosManager.updateSequence(topicName, partition, increment)
          })

          responsePerBroker.set(broker, formattedResponse)
        } catch (e) {
          responsePerBroker.delete(broker)
          throw e
        }
      });
    }

    return retrier(async (bail: any, retryCount: any, retryTime: any) => {
      const topics = topicMessages.map(({
        topic
      }: any) => topic)
      await cluster.addMultipleTargetTopics(topics)

      try {
        const requests = await createProducerRequests(responsePerBroker)
        // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
        await Promise.all(requests)
        // @ts-expect-error ts-migrate(2550) FIXME: Property 'from' does not exist on type 'ArrayConst... Remove this comment to see the full error message
        const responses = Array.from(responsePerBroker.values())
        return flatten(responses)
      } catch (e) {
        if (e.name === 'KafkaJSConnectionClosedError') {
          cluster.removeBroker({ host: e.host, port: e.port })
        }

        if (!cluster.isConnected()) {
          logger.debug(`Cluster has disconnected, reconnecting: ${e.message}`, {
            retryCount,
            retryTime,
          })
          await cluster.connect()
          await cluster.refreshMetadata()
          throw e
        }

        // This is necessary in case the metadata is stale and the number of partitions
        // for this topic has increased in the meantime
        if (
          staleMetadata(e) ||
          e.name === 'KafkaJSMetadataNotLoaded' ||
          e.name === 'KafkaJSConnectionError' ||
          e.name === 'KafkaJSConnectionClosedError' ||
          (e.name === 'KafkaJSProtocolError' && e.retriable)
        ) {
          logger.error(`Failed to send messages: ${e.message}`, { retryCount, retryTime })
          await cluster.refreshMetadata()
          throw e
        }

        logger.error(`${e.message}`, { retryCount, retryTime })
        if (e.retriable) throw e
        bail(e)
      }
    });
  };
}
