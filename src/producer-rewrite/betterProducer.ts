/** @format */

/**
KAFKA NODE - ENCODING FLOW - produce request
note:
actual send is created in baseCLient.js - line 88 - BELOW NOTES DO NOT TAKE INTO ACCOUNT HOW IT IS ACTUALLY SENT (but probably should)
see how encoder is used in sendtobroker line 415 of baseClient.js

 encodeRequestWithLength(request)  //wraps whole thing in buffermaker
  -request.length //int32be
  -request //buffer passed in as string, see buffermaker line 50 (you pass in buffers as strings, default behavior)
    -_encodeProduceRequest(clientId, correlationId, payloads, requireacks, acktimeoutms, apiversion) //returns above fn with request.make() as arg
      -encodeRequestHeader(clientId, correlationId, apikey, apiversion) //returns a buffermaker THIS IS OUR BASE
        -apiKey //int16
        -apiversion //int16
        -correlationId //int32
        -clientId.length //int32
        -clientId //string
        //BELOW ARE AFTER ENCODE REQUESTHEADER
        -requireAcks //int16
        -ackTimeoutMs //int32
        -topics.length //int32
        -topic name //string
        -reqs.length //int32 note - this is the number of messages being produced (i think)
        //FOR EACH MESSAGE IN REQS, we chain an encoded messageset as follows
        -partition //int32
        -messageSet.length //int32
        -messageSet //buffer passed in as string, see below
          //BELOW IS HOW MESSAGESET IS ENCODED
          -messageSet //buffer w below format (MADE BUFFER)
            -int64be(0) //int64 , no clue why
            -message length //int32 (this is the length of the msg buffer)
            -msg // string - see below, its actually a buffermaker with below format (THIS GETS MADE TWICE, see line 877)
              -magic // int8
              -attributes //int8
              -timestamp //int64 (only if magic = 1)
              -key // int32BE(-1) **NOTE - see line 899, pass in -1 for default behavior
              -value // string - same as above but string wil give default behavior
              //MAKE IT NOW, declare it as m, THEN DO THE BELOW
              -declare crc = crc32.signed(above buffer) - this is some kind of buffer error check, no clue but google knows
              -whole thing returns a made Buffermaker().int32be(crc).string(m).make()
        -REQUEST.MAKE() AND YOU DONE SON

 so, the whole thing looks like (array brackets [] indicate a made buffer):
 [apiKey, apiVersion, correlationId, clientId.length, clientId, requireAcks, ackTimeoutMs, topics.length, topic.length, 
  topicname, reqs.length [partition, messageset.length [0, msg.length, [crc[magic, attributes, timestamp, key, val]]]]]           
  
***************************************NOTES START*************************************************
in english:
-'request' is an instance of buffermaker class, initialized on line 848(protocol.js) by creating the request header.
-we then chain the items specific to the protocol guide onto that instance (line 850)
-sometimes we make sub-buffers, sometimes we dont, but essentially at the end we make one big ass buffer and pass it to encoderequestwithlength
which makes slightly bigger-ass buffer that is our final product

warning - the below information is based on trying to follow node-kafka and may be wrong - a good amount of hard to follow code

-PAYLOADS - SEE NOTES SECTION
-topic encoding - groupbytopic groups messages by their topic. 
  -line 852 - forEach topic in the array we:
    -0 - assume groupbytopic(payloads) spits out {topic : [{payload}]}
    -1 - chain onto request Int16BE(topic.length).string(topicName);
    -2 - run line 855 - reqs = array of pairs, map, returning only the 2nd argument which [{payload}] maybe? (????????????????)
    -3 - chain onto request Int32BE(reqs.length)
    -4 - run encodeMessageSet on each req
      messageSet = encodeMessageSet(p.messages, apiversion)
-topic data???
Notes:

-important - protocol_struct.js - something is going on here.....
-is the make only done at the very end, so we have a bunch of buffermakers chained and then we make() the request???
-*****PAYLOADS****:
  -ORIGINALLY LOOKS LIKE -payloads looks like this (typed on index.d.ts as ProduceRequest on line 203) - it's the topic data
                {
                  topic: string;
                  messages: any; // string[] | Array<KeyedMessage> | string | KeyedMessage
                  key?: string | Buffer; //optional?
                  partition?: number; //optional?
                  attributes?: number; //optional?
                }
  - BUT we need it to be an array, so on line 129 - they use buildPayloads(payloads, topicMetadata), which takes in the above and essentially 
  spits out an array, which (possibly) looks like:
                const mockRequest = [{
                topic: 'wtf',
                messages: 'wtfwtf',
                partition: 0,
                attributes: 0
              }]
    the above might be wrong....


    ok lets do it
 

 
  ultimately, the buffers are nested as follows:
  1 - giant wrapper of whole request, containing the headers
  2 - encoded message set
  3 - encoded message w crc 32
  4 - encoded message before crc 32

***************************************NOTES END*************************************************
*/

import BufferMaker from './buffermaker.js';
import { readAll, writeAll } from 'https://deno.land/std@0.105.0/io/util.ts';

import {crc32} from '../../utils/crc32.ts'

let date = new Date(Date.now()).toUTCString();

//hardcoding for one message
let _apiKey = 0;
let _apiVersion = 0;
let _correlationId = 0;
let _clientId = 'my-app'
let _requireAcks = 0;
let _ackTimeoutMs = 3000;
let _topics = ['sams-topic'];
let _numReqs = 1
let _partition = 0;
let _messageSet = [{
  topic: 'sams-topic',
  messages: 'wtfwtf',
  partition: 0,
  attributes: 0
}]
let _magic = 1;

// [apiKey, apiVersion, correlationId, clientId.length, clientId, requireAcks, ackTimeoutMs, topics.length, topic.length, 
//   topicname, reqs.length, partition, messageset.length [0, msg.length, [crc[magic, attributes, timestamp, key, val]]]]  
function starterBuff({clientId, correlationId, topics, requireAcks, ackTimeoutMs, apiVersion, apiKey, numReqs, partition, messageSet, magic} : any) {
  let temp = encodeMessageSet()
  console.log(clientId)

  const one = <any> new BufferMaker();
    one
    .Int16BE(apiKey)
    .Int16BE(apiVersion)
    .Int32BE(correlationId)
    .Int16BE(6)
    .string('my-app')
    .Int16BE(requireAcks)
    .Int32BE(ackTimeoutMs)
    .Int32BE(1) //topics array length
    .Int16BE(10) //topic name length, hardcoded for only one
    .string('sams-topic') //topic name, hardcoded for only one
    .Int32BE(numReqs)   
    .Int32BE(partition)
    .Int32BE(1) //messagesetlength hardcoded
    .string(temp);
  return one.make();
}

//SUPER HARDCODED, IT SHOULD TAKE IN MESSAGESET AND MAGIC
function encodeMessageSet () {
  var buffer = <any> new BufferMaker();
  var msg = encodeMessage();
  console.log(msg.length);
  buffer.Int64BE(0).Int32BE(msg.length).string(msg);

  // messageSet.forEach(function (message) {
  //   var msg = encodeMessage(message, magic);
  //   buffer.Int64BE(0).Int32BE(msg.length).string(msg);
  // });
  return buffer.make();
}

//SUPER HARDCODED, IT SHOULD TAKE IN MESSAGESET AND MAGIC ALSO
function encodeMessage () {
  let m = <any> new BufferMaker();
  m.Int8(1).Int8(-1).Int64BE(Date.now()).Int32BE(-1).string('you did it');
  m = m.make();
  let m2 = crc32(m);
  let returnMe = <any> new BufferMaker()
  return returnMe.Int32BE(m2).string(m).make();
}

const final = starterBuff({_clientId, _correlationId, _topics, _requireAcks, _ackTimeoutMs, _apiVersion,
_apiKey, _numReqs, _partition, _messageSet, _magic})

console.log(final)


//send that bitch
async function func (string: string = date) {
  const conn = await Deno.connect({
    hostname: 'localhost',
    port: 9093,
    transport: 'tcp',
  });
  console.log('Connected', conn);

  const writer = await writeAll(conn, final);

  conn.close()
}

func()








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


//  */
// const _request_api_key = 0;
// const _request_api_version = 0;
// const _correlation_id = 1;
// const _acks = 1;
// const _timeout_ms = 3000;
// const _td = [
//   {
//     name: 'sams-topic',
//     partition_data: [
//       {
//         index: 0,
//         //firstSequence: undefined,
//         records: [
//           {
//             key: '9-20-21',
//             value: Date.now(),
//           },
//         ],
//       },
//     ],
//   },
// ];

// const reqHeader = <any>await new BufferMaker();
// // .Int16BE(0)
// // .Int16BE(0)
// // .Int16BE(0)
// // .Int32BE(1)
// // .make();

// reqHeader.Int16BE(0).Int16BE(0).Int16BE(0).Int32BE(1);

// console.log(reqHeader.make());

// const reqHeaderMade = {reqHeader.make(), request: body}

// const produceRequest = <any>await new BufferMaker();

// const messageSet = <any> await new BufferMaker();

//             //requireAcks ackTimoutMs topics.length topic.length topic          reqs.length payloadPartition messagesSet.length messageSet
// produceRequest.Int16BE(0).Int32BE(1000).Int32BE(1).Int16BE(1).string('sams-topic').Int32BE(1).Int32BE(1).Int32BE(1).string(messageSet)

// const msg = <any> await new BufferMaker();

// messageSet.Int64BE(0).Int32BE(1).string(msg);

// //magic byte, message.attributes???
// msg.Int8(0).int8(message.attributes)
