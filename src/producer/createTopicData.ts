/** @format */
import { Encoder } from '../../protocol/encoder.js';

import {
  Broker,
  IHeaders,
  Message,
  PartitionOffset,
  ProducerBatch,
  TopicMessages,
  TopicOffsets,
} from '../../index.d.ts';

import MessageSet from '../../protocol/messageSet/index.js';

interface topicDataType {
  topicData: Array<{
    topic: string;
    partitions: Array<{
      partition: number;
      firstSequence?: number;
      messages: Message[];
    }>;
  }>;
}
//**ENCODING METHODS START HERE *********************************************/
//topicData structure

const string = JSON.stringify(Date.now());

const td = [
  {
    topic: 'sams-topic',
    partitions: [
      {
        partition: 1,
        firstSequence: undefined,
        messages: [
          {
            key: 'new-key6',
            value: string,
            partition: 1,
            headers: undefined,
            timestamp: Date.now(),
          },
        ],
      },
    ],
  },
];

export default function () {
  const producedMessage = ({ acks, timeout, topicData }: ProducerBatch) => ({
    apiKey: 0, //0
    apiVersion: 0,
    apiName: 'Produce',
    //expectResponse: () => acks !== 0,
    encode: async () => {
      return new Encoder()
        .writeInt16(acks)
        .writeInt32(timeout)
        .writeArray(topicData.map(encodeTopic));
    },
  });

  const encodeTopic = ({ topic, partitions }: any) => {
    return new Encoder()
      .writeString(topic)
      .writeArray(partitions.map(encodePartitions));
  };

  const encodePartitions = ({ partition, messages }: any) => {
    const messageSet = MessageSet({
      messageVersion: 0,
      compression: 0,
      entries: messages,
    });
    return new Encoder()
      .writeInt32(partition)
      .writeInt32(messageSet.size())
      .writeEncoder(messageSet);
  };

  return producedMessage({ acks: 1, timeout: 1000, topicData: td });
}
