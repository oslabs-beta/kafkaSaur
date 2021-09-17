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
 * ListOffsets Request (Version: 0) => replica_id [topics]
 *   replica_id => INT32
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition timestamp max_num_offsets
 *       partition => INT32
 *       timestamp => INT64
 *       max_num_offsets => INT32
 */

/** Offsets Response (Version: 0) => [responses]
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition error_code [offsets]
 *       partition => INT32
 *       error_code => INT16
 *       offsets => INT64
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
  const listOffsetMessage = ({ replicaId, topics }: any) => ({
    apiKey: 2,
    apiVersion: 0,
    apiName: 'ListOffsets',
    encode: async () => {
      return new Encoder()
        .writeInt32(replicaId)
        .writeArray(topics.map(encodeTopic));
    },
  });
  const encodeTopic = ({ topic, partitions }: any) => {
    return new Encoder()
      .writeString(topic)
      .writeArray(partitions.map(encodePartition));
  };

  const encodePartition = ({
    partition,
    timestamp = -1,
    maxNumOffsets = 1,
  }: any) => {
    return new Encoder()
      .writeInt32(partition)
      .writeInt64(timestamp)
      .writeInt32(maxNumOffsets);
  };

  //step 2a - make topic data
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

  //step 3 - create request
  const body = listOffsetMessage({
    replicaId: -1,
    topics: td, //remains the same for everything (until we abstract it away)
  });

  //comes from protocol/request.js
  const listOffsetsRequest = await request({
    correlationId: 1,
    clientId: 'my-app',
    request: body,
  });

  //step 4 - send request
  // Buffer created from invoking request. Then we write request to the connection with what's populated in the buffer
  const writer = await writeAll(conn, listOffsetsRequest.buf);
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

  const decode = async (rawData: any) => {
    const decoder = new Decoder(rawData);
    decoder.offset = 8;
    console.log('sam says hi, 130 ', decoder.buffer);
    //console.log('decodeResponses', decodeResponses);
    return {
      responses: decoder.readArray(decodeResponses),
    };
  };

  const decodeResponses = (decoder: any) => ({
    topic: decoder.readString(),
    partitions: decoder.readArray(decodePartitions),
  });

  const decodePartitions = (decoder: any) => ({
    partition: decoder.readInt32(),
    errorCode: decoder.readInt16(),
    offsets: decoder.readArray(decodeOffsets),
  });

  const decodeOffsets = (decoder: any) => decoder.readInt64().toString();

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
  console.log('full response', decoded.responses);

  console.log('decoded', decoded.responses[0].partitions[0].offsets);
}

func();
