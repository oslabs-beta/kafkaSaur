//interfaces for request options in broker
import { Message, CompressionTypes, TopicOffsets, ITopicConfig } from '../../index.d.ts'


export interface produceRequest {
  request: {
    topicData: Array<{
      topic: string;
      partitions: Array<{
        partition: number;
        firstSequence?: number;
        messages: Message[];
      }>;
    }>;
    transactionalId?: string;
    producerId?: number;
    producerEpoch?: number;
    acks?: number;
    timeout?: number;
    compression?: CompressionTypes;
  }
}

export interface fetchRequest {
  request: {
    replicaId?: number;
    isolationLevel?: number;
    maxWaitTime?: number;
    minBytes?: number;
    maxBytes?: number;
    topics: Array<{
      topic: string;
      partitions: Array<{
        partition: number;
        fetchOffset: string;
        maxBytes: number;
      }>;
    }>;
    rackId?: string;
  }
}

export interface joinGroupRequest {
  request: {
    groupId: string
    sessionTimeout: number
    rebalanceTimeout: number
    memberId: string
    protocolType: string
    groupProtocols: any[]
  }
}

export interface offsetCommitRequest {
  request: {
    groupId: string;
    groupGenerationId: number;
    memberId: string;
    retentionTime?: number;
    topics: TopicOffsets[];
  }
}

export interface offsetFetchRequest {
  request: { groupId: string; topics: TopicOffsets[] }
}

export interface createTopicsRequest {
  options: {
    validateOnly?: boolean;
    waitForLeaders?: boolean;
    timeout?: number;
    topics: ITopicConfig[];
  }
}

export interface createPartitionsRequest {
  options: {
    validateOnly?: boolean;
    timeout?: number;
    topicPartitions: ITopicPartitionConfig[];
  }
}