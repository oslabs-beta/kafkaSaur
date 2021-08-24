/** @format */
import { Encoder } from 'file:///C:/Users/wesge/Desktop/Coding/kafkaEx/protocol/encoder.js';

import { Buffer } from 'https://deno.land/std@0.76.0/node/buffer.ts';

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

async function func() {
  const conn = await Deno.connect({
    hostname: 'localhost',
    port: 9093,
    transport: 'tcp',
  });
  console.log('Connected', conn);

  const metaDataMessage = ({ topics }: any) => ({
    apiKey: 3,
    apiVersion: 0,
    apiName: 'Metadata',
    encode: async () => {
      return new Encoder().writeArray(topics);
    },
  });

  const test = await metaDataMessage({ topics: ['quickstart-events'] });
  //const encodedTest = await test.encode();

  const metaPleaseWork = await request({
    correlationId: 1,
    clientId: 'my-app',
    request: test,
  });

  console.log('GOT TO HERE SAM', metaPleaseWork);
  //console.log('encodedTest', encodedTest);
  const hello = await conn.write(metaPleaseWork.buf);
  console.log('hello', hello);

  const goodbye = await conn.read(metaPleaseWork.buf);
  console.log('goodbye', goodbye);
  conn.close();
}

func();
/**
 * Metadata Response (Version: 0) => [brokers] [topic_metadata]
 *   brokers => node_id host port
 *     node_id => INT32
 *     host => STRING
 *     port => INT32
 *   topic_metadata => topic_error_code topic [partition_metadata]
 *     topic_error_code => INT16
 *     topic => STRING
 *     partition_metadata => partition_error_code partition_id leader [replicas] [isr]
 *       partition_error_code => INT16
 *       partition_id => INT32
 *       leader => INT32
 *       replicas => INT32
 *       isr => INT32
 */
