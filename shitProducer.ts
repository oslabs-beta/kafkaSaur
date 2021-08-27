/** @format */
import { Encoder } from './protocol/encoder.js';

import { Decoder } from './protocol/decoder.js'

import { Buffer } from 'https://deno.land/std@0.76.0/node/buffer.ts';

import { readAll, writeAll } from 'https://deno.land/std@0.105.0/io/util.ts';

import MessageSet from './protocol/messageSet/index.js';

import request from './protocol/request.js';

//import v0response from './protocol/requests/produce/v0/response.js'

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
  //**ENCODING METHODS START HERE *********************************************/
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


  //**DECODING METHODS START HERE *************************************************/
  const partition: any = (decoder: any) => ({
    partition: decoder.readInt32(),
    errorCode: decoder.readInt16(),
    offset: decoder.readInt64().toString(),
  })

  const decode: any = async (rawData: any) => {
    const decoder = new Decoder(rawData)
    decoder.offset = 8
    console.log('decoder offset? ', decoder)
    console.log('partition', partition.partition)
    console.log('partition type', typeof partition)
    const topics = decoder.readArray((decoder: any) => ({
      topicName: decoder.readString(),
      partitions: decoder.readArray(partition),
    }))
  
    return {
      topics,
    }
  }

  //**ENCODING AND SENDING */
  const writer = await writeAll(conn, pleaseWork.buf);
  const response = new Uint8Array(512);
  

  //**GETTING RESPONSE */
  await conn.read(response);
  console.log('response:', response)

  //**DECODING RESPONSE */
  const newBuff = await new Buffer(response)
  console.log('new buff', newBuff)
  const decoded = await decode(newBuff);
  console.log('decoded', decoded)
  console.log('result: ', decoded.topics[0].partitions);
  //console.log('parsed: ', parsed);

  conn.close();
}

func('THIS IS A TEST AT 349 PM ON 8 26 21')

/**
 * ??????questions??????
 * -why does 8 work for the offset?
 * 
 * 
 * 
 * !!!!test ideas!!!!!
 * -what if we change what we are sending?
 */


