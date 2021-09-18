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
  //   FindCoordinator Request (Version: 0) => key
  //   key => STRING
  //step 2 - encode according to request message protocol - look in protocol/[listOffsets(or w/e)]/[message]/[version]/request.js!!
  const findCoordinator = ({ groupId }: any) => ({
    apiKey: 10,
    apiVersion: 0,
    apiName: 'GroupCoordinator',
    encode: async () => {
      return new Encoder().writeString(groupId);
    },
  });

  //step 2a - make topic data
  // const td = [
  //   {
  //     topic: 'sams-topic',
  //     partitions: [
  //       {
  //         partition: 1,
  //         offset: ['268'],
  //         // metadata: ,
  //       },
  //     ],
  //   },
  // ];

  // OffsetCommit Request (Version: 0) => group_id [topics]
  //   group_id => STRING
  //   topics => name [partitions]
  //     name => STRING
  //     partitions => partition_index committed_offset committed_metadata
  //       partition_index => INT32
  //       committed_offset => INT64
  //       committed_metadata => NULLABLE_STRING

  const body = findCoordinator({
    //WHAT IS THE GROUP ID!?
    groupId: '',
    //remains the same for everything (until we abstract it away)
  });

  const findCoordinatorRequest = await request({
    correlationId: 1,
    clientId: 'my-app',
    request: body,
  });

  const decode = async (rawData: any) => {
    const decoder = new Decoder(rawData);
    const errorCode = decoder.readInt16();

    //failIfVersionNotSupported(errorCode)

    const coordinator = {
      nodeId: decoder.readInt32(),
      host: decoder.readString(),
      port: decoder.readInt32(),
    };

    return {
      errorCode,
      coordinator,
    };
  };

  /**
   * OffsetCommit Response (Version: 0) => [responses]
   *   responses => topic [partition_responses]
   *     topic => STRING
   *     partition_responses => partition error_code
   *       partition => INT32
   *       error_code => INT16
   */

  console.log('offsetCommit.buff', findCoordinatorRequest.buf);

  const writer = await writeAll(conn, findCoordinatorRequest.buf);
  const response = new Uint8Array(512);

  await conn.read(response);
  console.log('SAM 110, ', response);

  const newBuff = await new Buffer(response);
  const decoded = await decode(newBuff);

  console.log('full response', decoded);
  console.log('full response', decoded);

  //console.log('decoded', decoded.responses[0].partitions[0].offsets);
}

func();
