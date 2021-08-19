/** @format */

import {
  Client,
  Packet,
  Event,
} from 'https://deno.land/x/tcp_socket@0.0.1/mods.ts';

import { Encoder } from './protocol/encoder.js';

async function func() {
  const ms1 = [0];
  const ms2 = [1];

  const conn = await Deno.connect({
    hostname: 'localhost',
    port: 9093,
    transport: 'tcp',
  });
  console.log('Connected', conn);

  const apiKey = 0;
  const apiVersion = 0;
  const correlationId = 0;
  const clientId = 1;
  const payload = [
    255, 255, 0, 0, 3, 232, 0, 0, 0, 1, 0, 12, 116, 101, 115, 116, 45, 116, 111,
    112, 105, 99, 45, 49, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 68, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 22, 76, 31, 197, 168, 0, 0, 0, 0, 0, 1, 49, 0, 0, 0, 7, 118,
    97, 108, 117, 101, 45, 49, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 22, 162, 136,
    70, 226, 0, 0, 0, 0, 0, 1, 50, 0, 0, 0, 7, 118, 97, 108, 117, 101, 45, 50,
    0, 0, 0, 1, 0, 0, 0, 34, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 78, 42, 58,
    27, 0, 0, 0, 0, 0, 1, 51, 0, 0, 0, 7, 118, 97, 108, 117, 101, 45, 51,
  ];

  //   const requestPayload = new Encoder()
  //     .writeInt16(apiKey)
  //     .writeInt16(apiVersion)
  //     .writeInt32(correlationId)
  //     .writeString(clientId)
  //     .writeEncoder(payload);

  //   return new Encoder()
  //     .writeInt32(requestPayload.size())
  //     .writeEncoder(requestPayload);
  // }
}

func();
