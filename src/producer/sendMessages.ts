/** @format */

import flatten from '../utils/flatten.ts';
import { KafkaJSMetadataNotLoaded } from '../errors.ts';
import { staleMetadata } from '../protocol/error.ts';
import groupMessagesPerPartition from './groupMessagesPerPartition.ts';
import createTopicData from './createTopicData.ts';
import responseSerializer from './responseSerializer.ts';

const { keys } = Object;

/**
 * @param {Object} options
 * @param {import("../../types").Logger} options.logger
 * @param {import("../../types").Cluster} options.cluster
 * @param {ReturnType<import("../../types").ICustomPartitioner>} options.partitioner
 * @param {import("./eosManager").EosManager} options.eosManager
 * @param {import("../retry").Retrier} options.retrier
 */
export default ({ logger, cluster, partitioner, eosManager, retrier }: any) => {
  return async ({ acks, timeout, compression, topicMessages }: any) => {
    /** @type {Map<import("../../types").Broker, any[]>} */
    const responsePerBroker = await new Map();

    /** @param {Map<import("../../types").Broker, any[]>} responsePerBroker */
    const createProducerRequests = async (responsePerBroker: any) => {
      const topicMetadata = new Map();

      await cluster.refreshMetadataIfNecessary();

      for (const { topic, messages } of topicMessages) {
        const partitionMetadata = cluster.findTopicPartitionMetadata(topic);

        if (partitionMetadata.length === 0) {
          logger.debug('Producing to topic without metadata', {
            topic,
            targetTopics: Array.from(cluster.targetTopics),
          });

          throw new KafkaJSMetadataNotLoaded(
            'Producing to topic without metadata'
          );
        }

        const messagesPerPartition = groupMessagesPerPartition({
          topic,
          partitionMetadata,
          messages,
          partitioner,
        });

        const partitions = keys(messagesPerPartition);
        const sequencePerPartition = partitions.reduce(
          (result: any, partition) => {
            result[partition] = eosManager.getSequence(topic, partition);
            return result;
          },
          {}
        );

        const partitionsPerLeader = cluster.findLeaderForPartitions(
          topic,
          partitions
        );
        const leaders = keys(partitionsPerLeader);

        topicMetadata.set(topic, {
          partitionsPerLeader,
          messagesPerPartition,
          sequencePerPartition,
        });

        for (const nodeId of leaders) {
          const broker = await cluster.findBroker({ nodeId });
          if (!responsePerBroker.has(broker)) {
            responsePerBroker.set(broker, null);
          }
        }
      }

      const brokers = Array.from(responsePerBroker.keys());
      const brokersWithoutResponse = brokers.filter(
        (broker: any) => !responsePerBroker.get(broker)
      );
      return brokersWithoutResponse.map(async (broker: any) => {
        const entries = Array.from(topicMetadata.entries());
        const topicDataForBroker = entries
          .filter(
            ([_, { partitionsPerLeader }]: any) =>
              !!partitionsPerLeader[broker.nodeId]
          )
          .map(
            ([
              topic,
              {
                partitionsPerLeader,
                messagesPerPartition,
                sequencePerPartition,
              },
            ]: any) => ({
              topic,
              partitions: partitionsPerLeader[broker.nodeId],
              sequencePerPartition,
              messagesPerPartition,
            })
          );

        const topicData = createTopicData(topicDataForBroker);

        try {
          if (eosManager.isTransactional()) {
            await eosManager.addPartitionsToTransaction(topicData);
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
          });

          const expectResponse = acks !== 0;
          const formattedResponse = expectResponse
            ? responseSerializer(response)
            : [];

          formattedResponse.forEach(({ topicName, partition }: any) => {
            const increment =
              topicMetadata.get(topicName).messagesPerPartition[partition]
                .length;

            eosManager.updateSequence(topicName, partition, increment);
          });

          responsePerBroker.set(broker, formattedResponse);
        } catch (e) {
          responsePerBroker.delete(broker);
          throw e;
        }
      });
    };

    return retrier(async (bail: any, retryCount: any, retryTime: any) => {
      const topics = topicMessages.map(({ topic }: any) => topic);
      await cluster.addMultipleTargetTopics(topics);

      try {
        const requests = await createProducerRequests(responsePerBroker);
        await Promise.all(requests);
        const responses = Array.from(responsePerBroker.values());
        return flatten(responses);
      } catch (e: any) {
        if (e.name === 'KafkaJSConnectionClosedError') {
          cluster.removeBroker({ host: e.host, port: e.port });
        }

        if (!cluster.isConnected()) {
          logger.debug(`Cluster has disconnected, reconnecting: ${e.message}`, {
            retryCount,
            retryTime,
          });
          await cluster.connect();
          await cluster.refreshMetadata();
          throw e;
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
          logger.error(`Failed to send messages: ${e.message}`, {
            retryCount,
            retryTime,
          });
          await cluster.refreshMetadata();
          throw e;
        }

        logger.error(`${e.message}`, { retryCount, retryTime });
        if (e.retriable) throw e;
        bail(e);
      }
    });
  };
};
