/** @format */
import { Encoder } from 'file:///C:/Users/wesge/Desktop/Coding/kafkaEx/protocol/encoder.js';

import { Decoder } from 'file:///C:/Users/wesge/Desktop/Coding/kafkaEx/protocol/decoder.js';

import { Buffer } from 'https://deno.land/std@0.76.0/node/buffer.ts';

import { readAll, writeAll } from 'https://deno.land/std@0.105.0/io/util.ts';

import request from 'file:///C:/Users/wesge/Desktop/Coding/kafkaEx/protocol/request.js';

import { readerFromStreamReader } from 'https://deno.land/std/io/mod.ts';

import {
  ProducerBatch,
  Message,
  IHeaders,
  TopicMessages,
  Broker,
  TopicOffsets,
  PartitionOffset,
} from './index.d.ts';

// import { Produce: apiKey } from '../../apiKeys'

// import { Produce: apiKey } from './protocol/requests/apiKeys'

import MessageSet from './protocol/messageSet/index.js';

import {
  Client,
  Packet,
  Event,
} from 'https://deno.land/x/tcp_socket@0.0.1/mods.ts';

let date = await new Date(Date.now()).toUTCString();

export default async function func(string: string = date) {
  console.log(typeof string);
  const conn = await Deno.connect({
    hostname: 'localhost',
    port: 9093,
    transport: 'tcp',
  });
  //console.log('Connected', conn.write);

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

  //producedMessage = ({acks, timeout, topicData}: ProducerBatch) =>
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

  //topicData structure
  const td = [
    {
      topic: 'quickstart-events',
      partitions: [
        {
          partition: 0,
          firstSequence: undefined,
          messages: [
            {
              key: 'new-key6',
              value: string,
              partition: 0,
              headers: undefined,
              timestamp: Date.now(),
            },
          ],
        },
      ],
    },
  ];

  const message = producedMessage({
    acks: 0,
    timeout: 1000,
    topicData: td,
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

  const pleaseWork = await request({
    correlationId: 1,
    clientId: 'my-app',
    request: message,
  });

  console.log('GOT TO HERE SAM', pleaseWork);

  const denoVersion = await conn.write(pleaseWork.buf);

  console.log('Hello is ', denoVersion);

  conn.close();
}

func();
