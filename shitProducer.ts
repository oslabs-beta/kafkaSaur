/** @format */
import { Encoder } from './protocol/encoder.js';

//import { Decoder } from './protocol/decoder.js'

import { Buffer } from 'https://deno.land/std@0.76.0/node/buffer.ts';

import { readAll, writeAll } from 'https://deno.land/std@0.105.0/io/util.ts';

import MessageSet from './protocol/messageSet/index.js';

import request from './protocol/request.js';

import {
  ProducerBatch,
  Message,
  IHeaders,
  TopicMessages,
  Broker,
  TopicOffsets,
  PartitionOffset,
} from './index.d.ts';

import {
  Client,
  Packet,
  Event,
} from 'https://deno.land/x/tcp_socket@0.0.1/mods.ts';

let date = new Date(Date.now()).toUTCString();

export default async function func(string: string = date) {
  const conn = await Deno.connect({
    hostname: '127.0.0.1',
    port: 9099,
    transport: 'tcp',
  });
  console.log('Connected', conn);

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

  const message = producedMessage({
    acks: 1,
    timeout: 1000,
    topicData: td,
  });


  const pleaseWork = await request({
    correlationId: 1,
    clientId: 'my-app',
    request: message,
  });

  console.log('before sending,', pleaseWork.buf)
  const writer = await writeAll(conn, pleaseWork.buf);
  const tempBuf = new Uint8Array(100);
  const dcd = new TextDecoder()
  //READ INTO THE BUFFER - THE ARGUMENT IS THE DESTINATION, CALL READ ON THE CONNECTION
  await conn.read(tempBuf);
  console.log('response:', tempBuf)
  console.log('decoded', dcd.decode(tempBuf))


  conn.close();
}

func()


