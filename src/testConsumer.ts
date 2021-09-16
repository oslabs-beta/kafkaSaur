/** @format */

import { Encoder } from '../protocol/encoder.js';
import request from '../protocol/request.js';
import { readAll, writeAll } from 'https://deno.land/std@0.105.0/io/util.ts';
import { Decoder } from '../protocol/decoder.js';
import MessageSetDecoder from '../protocol/messageSet/decoder.js';
import { Buffer } from 'https://deno.land/std@0.76.0/node/buffer.ts';

/*
Fetch Request (Version: 0) => replica_id max_wait_ms min_bytes [topics]
  replica_id => INT32 ; should be -1 for consumer
  max_wait_ms => INT32 ; idk like 5000 or something
  min_bytes => INT32 ; min bytes to accum in the response
  topics => topic [partitions]
    topic => STRING ; name of topic
    partitions => partition fetch_offset partition_max_bytes
      partition => INT32 ; number of partition 0
      fetch_offset => INT64 ; message offset???
      partition_max_bytes => INT32  ; max bytes to fetch

*/

//type imports
import {
  Broker,
  IHeaders,
  Message,
  PartitionOffset,
  ProducerBatch,
  TopicMessages,
  TopicOffsets,
} from '../index.d.ts';

//*****here is the actual function
export default async function func() {
  //step 0 - intiate connection
  const conn = await Deno.connect({
    hostname: 'localhost',
    port: 9093,
    transport: 'tcp',
  });
  console.log('Connected', conn);

  //step 00 - type everything
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

  //step 1 - big encode method - encodes entire message
  const consumeMessage = ({
    replicaId,
    maxWaitTime,
    minBytes,
    topics,
  }: any) => ({
    apiKey: 1,
    apiVersion: 0,
    apiName: 'Fetch',
    encode: async () => {
      return new Encoder()
        .writeInt32(replicaId)
        .writeInt32(maxWaitTime)
        .writeInt32(minBytes)
        .writeArray(topics.map(encodeTopic));
    },
  });

  //step 2a - topic encode method - encodes topic and partitions
  const encodeTopic = ({ topic, partitions }: any) => {
    return new Encoder()
      .writeString(topic)
      .writeArray(partitions.map(encodePartition));
  };

  //step 2b - partition encoder - nested in 2a
  const encodePartition = ({ partition, fetchOffset, maxBytes }: any) => {
    return new Encoder()
      .writeInt32(partition)
      .writeInt64(fetchOffset)
      .writeInt32(maxBytes);
  };

  //step 3 - create topic data
  const td = [
    {
      topic: 'sams-topic',
      partitions: [
        {
          partition: 1,
          fetchOffset: '0',
          //maxBytes: 2048
          maxBytes: 2048,
        },
      ],
    },
  ];

  //step 4 - use big encoder to make a message
  const message = consumeMessage({
    replicaId: -1,
    maxWaitTime: 100000,
    minBytes: 1,
    topics: td,
  });

  //step 5 - create request
  const consumeRequest = await request({
    correlationId: 1,
    clientId: 'my-app',
    request: message,
  });

  /**
   * Fetch Response (Version: 0) => [responses]
   *   responses => topic [partition_responses]
   *     topic => STRING
   *     partition_responses => partition_header record_set
   *       partition_header => partition error_code high_watermark
   *         partition => INT32
   *         error_code => INT16
   *         high_watermark => INT64
   *       record_set => RECORDS
   */

  const decodePartition = async (decoder: any) => ({
    partition: decoder.readInt32(),
    errorCode: decoder.readInt16(),
    highWatermark: decoder.readInt64().toString(),
    messages: await MessageSetDecoder(decoder),
  });

  //takes in above
  const decodeResponse = async (decoder: any) => ({
    topicName: decoder.readString(),
    partitions: await decoder.readArrayAsync(decodePartition),
  });

  //takes in above
  const decode = async (rawData: any) => {
    const decoder = new Decoder(rawData);
    decoder.offset = 8;

    const responses = await decoder.readArrayAsync(decodeResponse);

    return {
      responses,
    };
  };

  //step 6 - send it
  //**ENCODING AND SENDING */

  const dcd = new TextDecoder();

  const writer = await writeAll(conn, consumeRequest.buf);
  const response = new Uint8Array(512);

  //**GETTING RESPONSE */
  await conn.read(response);
  console.log('response:', response);

  /**DECODING RESPONSE */
  // newBuff is changing the Uint8Array from response into a Buffer class/type
  const newBuff = await new Buffer(response);
  console.log('new buff', newBuff);
  const decoded = await decode(newBuff);

  console.log('decoded with text decoder: ', dcd.decode(response));
  console.log('decoded: ', decoded);
  console.log('partitions: ', decoded.responses);
  console.log(
    'messages array length',
    decoded.responses[0].partitions[0].messages.byteLength
  );
  console.log(
    'k/v pair 0: ',
    'KEY:',
    dcd.decode(decoded.responses[0].partitions[0].messages[0].key),
    ' ',
    'VALUE:',
    dcd.decode(decoded.responses[0].partitions[0].messages[0].value)
  );
  console.log(
    'k/v pair 1: ',
    'KEY:',
    dcd.decode(decoded.responses[0].partitions[0].messages[1].key),
    ' ',
    'VALUE:',
    dcd.decode(decoded.responses[0].partitions[0].messages[1].value)
  );
}

func();

// setInterval(() => func(), 2000);
