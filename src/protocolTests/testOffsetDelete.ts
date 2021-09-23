/** @format */

import { Encoder } from '../protocol/encoder.js';
import request from '../protocol/request.js';
import { readAll, writeAll } from 'https://deno.land/std@0.105.0/io/util.ts';
import { Decoder } from '../protocol/decoder.js';
import MessageSetDecoder from '../protocol/messageSet/decoder.js';
import { Buffer } from 'https://deno.land/std@0.76.0/node/buffer.ts';

// OffsetDelete Request (Version: 0) => group_id [topics]
//   group_id => STRING
//   topics => name [partitions]
//     name => STRING
//     partitions => partition_index
//       partition_index => INT32

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
  const offsetDeleteMessage = ({ topics, groupId }: any) => ({
    apiKey: 47,
    apiVersion: 0,
    apiName: 'OffsetDelete',
    encode: async () => {
      return new Encoder()
        .writeString(groupId)
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
  const body = offsetDeleteMessage({
    groupId: '',
    topics: td, //remains the same for everything (until we abstract it away)
  });

  //comes from protocol/request.js
  const offsetDeleteRequest = await request({
    correlationId: 1,
    clientId: 'my-app',
    request: body,
  });

  //step 4 - send request
  // Buffer created from invoking request. Then we write request to the connection with what's populated in the buffer
  const writer = await writeAll(conn, offsetDeleteRequest.buf);
  const response = new Uint8Array(512);

  //step 5 - get response
  await conn.read(response);
  console.log('response', response);

  //step 6 - decode according to response message protocol - look in protocol/[message]/[version]/response.js!!
  //RESPONSE FOR OffsetDelete from Kafka

  // OffsetDelete Response (Version: 0) => error_code throttle_time_ms [topics]
  // error_code => INT16
  // throttle_time_ms => INT32
  // topics => name [partitions]
  //   name => STRING
  //   partitions => partition_index error_code
  //     partition_index => INT32
  //     error_code => INT16

  const decode = async (rawData: any) => {
    const decoder = new Decoder(rawData);
    decoder.offset = 8;
    //console.log('sam says hi, 130 ', decoder.buffer);
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
