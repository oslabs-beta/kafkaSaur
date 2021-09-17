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
  const offsetCommitMessage = ({ groupId, topics }: any) => ({
    apiKey: 8,
    apiVersion: 0,
    apiName: 'OffsetCommit',
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

  const encodePartition = ({ partition, offset, metadata = null }: any) => {
    return new Encoder()
      .writeInt32(partition)
      .writeInt64(offset)
      .writeString(metadata);
  };

  //step 2a - make topic data
  const td = [
    {
      topic: 'sams-topic',
      partitions: [
        {
          partition: 1,
          offset: 120,
          // metadata: ,
        },
      ],
    },
  ];

  // OffsetCommit Request (Version: 0) => group_id [topics]
  //   group_id => STRING
  //   topics => name [partitions]
  //     name => STRING
  //     partitions => partition_index committed_offset committed_metadata
  //       partition_index => INT32
  //       committed_offset => INT64
  //       committed_metadata => NULLABLE_STRING

  const body = offsetCommitMessage({
    //WHAT IS THE GROUP ID!?
    group_id: 'sams-topic',
    topics: td, //remains the same for everything (until we abstract it away)
  });

  const offsetCommitRequest = await request({
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
    errorCode: decoder.readInt16(),
  });

  /**
   * OffsetCommit Response (Version: 0) => [responses]
   *   responses => topic [partition_responses]
   *     topic => STRING
   *     partition_responses => partition error_code
   *       partition => INT32
   *       error_code => INT16
   */

  console.log('offsetCommit.buff', offsetCommitRequest.buf);

  const writer = await writeAll(conn, offsetCommitRequest.buf);
  const response = new Uint8Array(512);

  await conn.read(response);
  console.log('SAM 110, ', response);

  const newBuff = await new Buffer(response);
  const decoded = await decode(newBuff);

  console.log('full response', decoded);

  //console.log('decoded', decoded.responses[0].partitions[0].offsets);
}

func();
