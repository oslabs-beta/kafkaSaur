/** @format */

import { Buffer } from 'https://deno.land/std@0.76.0/node/buffer.ts';

import { readAll, writeAll } from 'https://deno.land/std@0.105.0/io/util.ts';

import BufferMaker from './buffermaker.js';

import {
  Client,
  Event,
  Packet,
} from 'https://deno.land/x/tcp_socket@0.0.1/mods.ts';

let date = new Date(Date.now()).toUTCString();

// export default async function func(string: string = date) {
//   const conn = await Deno.connect({
//     hostname: 'localhost',
//     port: 9093,
//     transport: 'tcp',
//   });
//   console.log('Connected', conn);

/**
 *Produce Request (Version: 0) => acks timeout_ms [topic_data] 
  acks => INT16
  timeout_ms => INT32
  topic_data => name [partition_data] 
    name => STRING
    partition_data => index records 
      index => INT32
      records => RECORDS (NOTE: THIS IS MESSAGE SET)

acks	-The number of acknowledgments the producer requires the leader to have received before considering a request complete. Allowed values: 0 for no acknowledgments, 1 for only the leader and -1 for the full ISR.
timeout_ms-	The timeout to await a response in miliseconds.
topic_data-	Each topic to produce to.
  name-	The topic name.
partition_data-	Each partition to produce to.
  index-	The partition index.
  records	-The record data to be produced.

  Request Header v0 => request_api_key request_api_version correlation_id 
  request_api_key => INT16
  request_api_version => INT16
  correlation_id => INT32


 */
const _request_api_key = 0;
const _request_api_version = 0;
const _correlation_id = 1;
const _acks = 1;
const _timeout_ms = 3000;
const _td = [
  {
    name: 'sams-topic',
    partition_data: [
      {
        index: 0,
        //firstSequence: undefined,
        records: [
          {
            key: '9-20-21',
            value: Date.now(),
          },
        ],
      },
    ],
  },
];

const reqHeader = <any>await new BufferMaker();
// .Int16BE(0)
// .Int16BE(0)
// .Int16BE(0)
// .Int32BE(1)
// .make();

reqHeader.Int16BE(0).Int16BE(0).Int16BE(0).Int32BE(1);

console.log(reqHeader.make());

const reqHeaderMade = {reqHeader.make(), request: body}

const produceRequest = <any>await new BufferMaker();

const messageSet = <any> await new BufferMaker();

            //requireAcks ackTimoutMs topics.length topic.length topic          reqs.length payloadPartition messagesSet.length messageSet
produceRequest.Int16BE(0).Int32BE(1000).Int32BE(1).Int16BE(1).string('sams-topic').Int32BE(1).Int32BE(1).Int32BE(1).string(messageSet)

const msg = <any> await new BufferMaker();

messageSet.Int64BE(0).Int32BE(1).string(msg);

//magic byte, message.attributes???
msg.Int8(0).int8(message.attributes)






 


// const sendMessage = await request({
//   correlationId: 1,
//   clientId: 'my-app',
//   request: message,
// });

console.log(reqHeaderMade);

const body = 'stuff'

//**ENCODING AND SENDING */

//**GETTING RESPONSE */
//await conn.read(response);

//**DECODING RESPONSE */

// conn.close();
