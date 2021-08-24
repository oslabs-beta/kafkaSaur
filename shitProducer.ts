/** @format */
import { Encoder } from 'file:///C:/Users/wesge/Desktop/Coding/kafkaEx/protocol/encoder.js';

import { Buffer } from 'https://deno.land/std@0.76.0/node/buffer.ts';

import { readAll, writeAll } from 'https://deno.land/std@0.105.0/io/util.ts';

import request from 'file:///C:/Users/wesge/Desktop/Coding/kafkaEx/protocol/request.js';

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

  // const apiKey = new Uint16Array(1);
  // const apiVersion = new Uint16Array(1);
  // const correlationId = new Uint32Array(1);

  //var buf = new Uint8Array(316);
  // array.p((el, i) => (buf[i] = el));

  // console.log(buf); // 42
  // const messageArr = new Uint8Array(1);
  // messageArr[0] = await message.encode();
  // console.log(buf);
  //const test = await pleaseWork.encode();
  const pleaseWork = await request({
    correlationId: 1,
    clientId: 'my-app',
    request: message,
  });
  //const arr = new Uint8Array(1);
  // arr[0] = test;
  console.log('GOT TO HERE SAM', pleaseWork);

  // const hello = await conn
  //   .write(pleaseWork.buf)
  //   .then((res) => console.log('something else', res));

  const writingShit = await writeAll(conn, pleaseWork.buf).then((res) => res);

  // console.log('Hello is ', writingShit);

  const bufferContent = await readAll(conn);

  console.log('buffer content', bufferContent);

  // console.log('Is this real life? ', hello);
  // console.log('con.read.buf', await conn.read(buf));
  // await conn.read(buf);
  // console.log('Client-Response:', decoder.decode(buf));

  // const decoded = decoder.decode(buf);
  // console.log('Encoded shit: ', encoder.encode(decoded));
  conn.close();
}

// func();

// const kafkaJsEncoder = {
//   type: 'Buffer',
//   data: [
//     255, 255, 0, 0, 3, 232, 0, 0, 0, 1, 0, 12, 116, 101, 115, 116, 45, 116,
//     111, 112, 105, 99, 45, 49, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 68, 0, 0, 0,
//     0, 0, 0, 0, 0, 0, 0, 0, 22, 76, 31, 197, 168, 0, 0, 0, 0, 0, 1, 49, 0, 0,
//     0, 7, 118, 97, 108, 117, 101, 45, 49, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 22,
//     162, 136, 70, 226, 0, 0, 0, 0, 0, 1, 50, 0, 0, 0, 7, 118, 97, 108, 117,
//     101, 45, 50, 0, 0, 0, 1, 0, 0, 0, 34, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22,
//     78, 42, 58, 27, 0, 0, 0, 0, 0, 1, 51, 0, 0, 0, 7, 118, 97, 108, 117, 101,
//     45, 51,
//   ],
// };

// const array = [
//   1, 1, 1, 255, 255, 0, 0, 3, 232, 0, 0, 0, 1, 0, 12, 116, 101, 115, 116, 45,
//   116, 111, 112, 105, 99, 45, 49, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 68, 0, 0,
//   0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 76, 31, 197, 168, 0, 0, 0, 0, 0, 1, 49, 0, 0,
//   0, 7, 118, 97, 108, 117, 101, 45, 49, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 22,
//   162, 136, 70, 226, 0, 0, 0, 0, 0, 1, 50, 0, 0, 0, 7, 118, 97, 108, 117, 101,
//   45, 50, 0, 0, 0, 1, 0, 0, 0, 34, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 78,
//   42, 58, 27, 0, 0, 0, 0, 0, 1, 51, 0, 0, 0, 7, 118, 97, 108, 117, 101, 45,
//   51,
// ];

//const decoder = new TextDecoder();
// const encoder = new TextEncoder();

// Producer Test Encoded
// {"type":"Buffer","data":[255,255,0,0,3,232,0,0,0,1,0,12,116,101,115,116,45,116,111,112,105,99,45,49,0,0,0,2,0,0,0,0,0,0,0,68,0,0,0,0,0,0,0,0,0,0,0,22,76,31,197,168,0,0,0,0,0,1,49,0,0,0,7,118,97,108,117,101,45,49,0,0,0,0,0,0,0,1,0,0,0,22,162,136,70,226,0,0,0,0,0,1,50,0,0,0,7,118,97,108,117,101,45,50,0,0,0,1,0,0,0,34,0,0,0,0,0,0,0,0,0,0,0,22,78,42,58,27,0,0,0,0,0,1,51,0,0,0,7,118,97,108,117,101,45,51]}

// Encode object
// {
//   buf: <Buffer ff ff 00 00 03 e8 00 00 00 01 00 0c 74 65 73 74 2d 74 6f 70 69 63 2d 31 00 00 00 02 00 00 00 00 00 00 00 44 00 00 00 00 00 00 00 00 00 00 00 16 4c 1f ... 462 more bytes>,
//   offset: 146
// }

// encoder.toJSON()
// {
//   type: 'Buffer',
//   data: [
//     255, 255,   0,   0,  3, 232,   0,   0,   0,  1,   0,  12,
//     116, 101, 115, 116, 45, 116, 111, 112, 105, 99,  45,  49,
//       0,   0,   0,   2,  0,   0,   0,   0,   0,  0,   0,  68,
//       0,   0,   0,   0,  0,   0,   0,   0,   0,  0,   0,  22,
//      76,  31, 197, 168,  0,   0,   0,   0,   0,  1,  49,   0,
//       0,   0,   7, 118, 97, 108, 117, 101,  45, 49,   0,   0,
//       0,   0,   0,   0,  0,   1,   0,   0,   0, 22, 162, 136,
//      70, 226,   0,   0,  0,   0,   0,   1,  50,  0,   0,   0,
//       7, 118,  97, 108,
//     ... 46 more items
//   ]
// }
