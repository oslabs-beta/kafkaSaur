/** @format */

import { Encoder } from '../protocol/encoder.js';
import request from '../protocol/request.js';
import { readAll, writeAll } from 'https://deno.land/std@0.105.0/io/util.ts';
import { Decoder } from '../protocol/decoder.js';
import MessageSetDecoder from '../protocol/messageSet/decoder.js';
import { Buffer } from 'https://deno.land/std@0.76.0/node/buffer.ts';

export default async function func() {
  const conn = await Deno.connect({
    hostname: 'localhost',
    port: 9093,
    transport: 'tcp',
  });
  console.log('Connected', conn);

  //ListGroups Request (Version: 0) =>

  //step 2 - encode according to request message protocol - look in protocol/[listOffsets(or w/e)]/[message]/[version]/request.js!!
  const groupListMessage = () => ({
    apiKey: 16,
    apiVersion: 0,
    apiName: 'ListGroups',
    encode: async () => {
      return new Encoder();
    },
  });

  // ListGroups Response (Version: 0) => error_code [groups]
  // error_code => INT16
  // groups => group_id protocol_type
  //   group_id => STRING
  //   protocol_type => STRING

  const decodeGroup = (decoder: any) => ({
    groupId: 'console-consumer-3063',
    protocolType: decoder.readString(),
  });

  const decode = async (rawData: any) => {
    const decoder = new Decoder(rawData);
    //const errorCode = decoder.readInt16();
    const groups = decoder.readArray(decodeGroup);
    // decoder.offset = 0;
    return {
      //errorCode,
      groups,
    };
  };

  const body = groupListMessage();

  const groupListRequest = await request({
    correlationId: 1,
    clientId: 'my-app',
    request: body,
  });

  console.log('groupListMessage', groupListRequest);

  const writer = await writeAll(conn, groupListRequest.buf);
  const response = new Uint8Array(512);

  await conn.read(response);
  console.log('SAM 110, ', response);

  const newBuff = await new Buffer(response);
  const decoded = await decode(newBuff);

  console.log('full response', decoded);
  console.log('full response', decoded.groups.length);
}

func();
