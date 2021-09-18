/** @format */
import { Encoder } from '../protocol/encoder.js';
import request from '../protocol/request.js';
import { readAll, writeAll } from 'https://deno.land/std@0.105.0/io/util.ts';
import { Decoder } from '../protocol/decoder.js';
import MessageSetDecoder from '../protocol/messageSet/decoder.js';
import { Buffer } from 'https://deno.land/std@0.76.0/node/buffer.ts';

// /step 1 - initiate connection
export default async function func() {
  const conn = await Deno.connect({
    hostname: 'localhost',
    port: 9093,
    transport: 'tcp',
  });
  console.log('Connected', conn);

  //step 2 - encode according to request message protocol - look in protocol/[listOffsets(or w/e)]/[message]/[version]/request.js!!
  const offsetFetchMessage = ({ groupId, topics }: any) => ({
    apiKey: 9,
    apiVersion: 1,
    apiName: 'OffsetFetch',
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

  const encodePartition = ({ partition }: any) => {
    return new Encoder().writeInt32(partition);
  };

  //step 2a - make topic data
  const td = [
    {
      topic: 'sams-topic',
      partitions: [
        {
          partition: 1,
          offset: 0,
          metadata: '',
        },
      ],
    },
  ];

  /**
   * OffsetFetch Request (Version: 1) => group_id [topics]
   *   group_id => STRING
   *   topics => topic [partitions]
   *     topic => STRING
   *     partitions => partition
   *       partition => INT32
   */

  const body = offsetFetchMessage({
    //WHAT IS THE GROUP ID!?
    groupId: '',
    topics: td, //remains the same for everything (until we abstract it away)
  });

  const offsetFetchRequest = await request({
    correlationId: 1,
    clientId: 'my-app',
    request: body,
  });

  const decode = async (rawData: any) => {
    const decoder = new Decoder(rawData);
    decoder.offset = 8;
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
    offset: decoder.readInt64().toString(),
    metadata: decoder.readString(),
    errorCode: decoder.readInt16(),
  });

  console.log('offsetFetch.buff', offsetFetchRequest.buf);

  const writer = await writeAll(conn, offsetFetchRequest.buf);
  const response = new Uint8Array(512);

  await conn.read(response);
  console.log('SAM 110, ', response);

  const newBuff = await new Buffer(response);
  const decoded = await decode(newBuff);

  console.log('full response', decoded);
  console.log('full response', decoded.responses[0]);

  //console.log('decoded', decoded.responses[0].partitions[0].offsets);
}

func();
