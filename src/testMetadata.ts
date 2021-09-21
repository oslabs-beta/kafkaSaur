/** @format */

/** @format */

/** @format */

import { Encoder } from '../protocol/encoder.js';
import request from '../protocol/request.js';
import { readAll, writeAll } from 'https://deno.land/std@0.105.0/io/util.ts';
import { Decoder } from '../protocol/decoder.js';
import MessageSetDecoder from '../protocol/messageSet/decoder.js';
import { Buffer } from 'https://deno.land/std@0.76.0/node/buffer.ts';

//TYPE IMPORTS!!!!

//STEP 0 - FIND THE MESSAGE FORMATS

/**
 * Metadata Request (Version: 0) => [topics]
 *   topics => STRING
 */

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

// step 0 - Type it!!!

//step 1 - initiate connection
export default async function func() {
  //step 0 - intiate connection
  const conn = await Deno.connect({
    hostname: 'localhost',
    port: 9093,
    transport: 'tcp',
  });
  console.log('Connected', conn);

  //step 2 - encode according to request message protocol - look in protocol/[listOffsets(or w/e)]/[message]/[version]/request.js!!
  const metadataMessage = ({ topics }: any) => ({
    apiKey: 3,
    apiVersion: 0,
    apiName: 'Metadata',
    encode: async () => {
      return new Encoder().writeArray(topics.map(encodeTopic));
    },
  });
  const encodeTopic = ({ topic }: any) => {
    return new Encoder().writeString(topic);
  };

  //   const encodePartition = ({
  //     partition,
  //     timestamp = -1,
  //     maxNumOffsets = 1,
  //   }: any) => {
  //     return new Encoder()
  //       .writeInt32(partition)
  //       .writeInt64(timestamp)
  //       .writeInt32(maxNumOffsets);
  //   };

  //step 2a - make topic data
  const messageBody = [
    {
      topic: 'sams-topic',
    },
  ];

  //step 3 - create request
  const body = metadataMessage({
    topics: messageBody, //remains the same for everything (until we abstract it away)
  });

  //comes from protocol/request.js
  const metadataRequest = await request({
    correlationId: 1,
    clientId: 'my-app',
    request: body,
  });

  //step 4 - send request
  // Buffer created from invoking request. Then we write request to the connection with what's populated in the buffer
  const writer = await writeAll(conn, metadataRequest.buf);
  const response = new Uint8Array(512);

  //step 5 - get response
  await conn.read(response);
  console.log('response', response);

  //step 6 - decode according to response message protocol - look in protocol/[message]/[version]/response.js!!
  // const decode = async (rawData: any) => {
  //   const decoder = new Decoder(rawData);
  //   decoder.offset = 8;

  //   const responses = await decoder.readArrayAsync(decodeResponse);

  //   return {
  //     responses,
  //   };
  // };

  const broker = (decoder: any) => ({
    nodeId: decoder.readInt32(),
    host: decoder.readString(),
    port: decoder.readInt32(),
  });

  const topicMetadata = (decoder: any) => ({
    topicErrorCode: decoder.readInt16(),
    topic: decoder.readString(),
    partitionMetadata: decoder.readArray(partitionMetadata),
  });

  const partitionMetadata = (decoder: any) => ({
    partitionErrorCode: decoder.readInt16(),
    partitionId: decoder.readInt32(),
    // leader: The node id for the kafka broker currently acting as leader
    // for this partition
    leader: decoder.readInt32(),
    replicas: decoder.readArray((d: any) => d.readInt32()),
    isr: decoder.readArray((d: any) => d.readInt32()),
  });

  const decode = async (rawData: any) => {
    const decoder = new Decoder(rawData);
    decoder.offset = 8;
    return {
      brokers: decoder.readArray(broker),
      topicMetadata: decoder.readArray(topicMetadata),
    };
  };
  const newBuff = await new Buffer(response);
  const decoded = await decode(newBuff);

  //returns array of topics
  /* response = [
    {
      topic: NAME
      partitions: [
        {
          partition: NUMBER,
          errorCode: 0,
          offsets: [""]
        }
      ]
    }
  ]*/
  console.log('full response', decoded);

  console.log('decoded', decoded);
  console.log('decoded', decoded.topicMetadata[0].partitionMetadata);

  //I found an interesting thing about the error we were getting.
  // Oh?
  //look at line 43 in OffsetFetch
  //So this is how we pull the metadata they're talking about....
  //maybe the answer is in here
}

func();
