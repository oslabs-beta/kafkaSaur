import { Encoder } from './protocol/encoder.js';
import request from './protocol/request.js';
import { readAll, writeAll } from 'https://deno.land/std@0.105.0/io/util.ts';
import { Decoder } from './protocol/decoder.js'
import { MessageSetDecoder } from './protocol/messageSet/decoder.js'

/*
Fetch Request (Version: 0) => replica_id max_wait_ms min_bytes [topics] 
  replica_id => INT32 ; should be -1 for consumer
  max_wait_ms => INT32 ; idk like 5000 or something
  min_bytes => INT32 ; min bytes to accum in the response
  topics => topic [partitions] 
    topic => STRING ; name of topic
    partitions => partition fetch_offset partition_max_bytes 
      partition => INT32 ; number of partition 0
      fetch_offset => INT64 ; message offset???
      partition_max_bytes => INT32  ; max bytes to fetch
    
*/

//type imports
import {
  ProducerBatch,
  Message,
  IHeaders,
  TopicMessages,
  Broker,
  TopicOffsets,
  PartitionOffset,
} from './index.d.ts';

//*****here is the actual function
export default async function func() {
  //step 0 - intiate connection
  const conn = await Deno.connect({
    hostname: '127.0.0.1',
    port: 9099,
    transport: 'tcp',
  });
  console.log('Connected', conn);

  //step 00 - type everything
  interface topicDataType {
    topicData: Array<{
      topic: string;
      partitions: Array<{
        partition: number;
        firstSequence?: number;
        messages: Message[];
      }>;
    }>;
  }

  //step 1 - big encode method - encodes entire message
  const consumeMessage = ({ replicaId, maxWaitTime, minBytes, topics }: any) => ({
    apiKey: 1,
    apiVersion: 0,
    apiName: 'Fetch',
    encode: async () => {
      return new Encoder()
      .writeInt32(replicaId)
      .writeInt32(maxWaitTime)
      .writeInt32(minBytes)
      .writeArray(topics.map(encodeTopic))
    }
  })

  //step 2a - topic encode method - encodes topic and partitions
  const encodeTopic = ({ topic, partitions }: any) => {
    return new Encoder().writeString(topic).writeArray(partitions.map(encodePartition))
  }

  //step 2b - partition encoder - nested in 2a
  const encodePartition = ({ partition, fetchOffset, maxBytes }: any) => {
    return new Encoder()
      .writeInt32(partition)
      .writeInt64(fetchOffset)
      .writeInt32(maxBytes)
  }

  //step 3 - create topic data
  const td = [
      {
      topic: 'quickstart-events',
      partitions: [
        {
          partition: 0,
          fetchOffset: '0',
          maxBytes: 2048
        }
      ]
    }
  ]

  //step 4 - use big encoder to make a message  
  const message = consumeMessage({
    replicaId: -1,
    maxWaitTime: 10000,
    minBytes: 9,
    topics: td
  })

  //step 5 - create request
  const pleaseWork = await request({
    correlationId: 1,
    clientId: 'my-app',
    request: message,
  });

  /**
 * Fetch Response (Version: 0) => [responses]
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition_header record_set
 *       partition_header => partition error_code high_watermark
 *         partition => INT32
 *         error_code => INT16
 *         high_watermark => INT64
 *       record_set => RECORDS
 */

   const decodePartition = async decoder => ({
    partition: decoder.readInt32(),
    errorCode: decoder.readInt16(),
    highWatermark: decoder.readInt64().toString(),
    messages: await MessageSetDecoder(decoder),
  })
  
  const decodeResponse = async decoder => ({
    topicName: decoder.readString(),
    partitions: await decoder.readArrayAsync(decodePartition),
  })
  
  const decode = async rawData => {
    const decoder = new Decoder(rawData)
    const responses = await decoder.readArrayAsync(decodeResponse)
  
    return {
      responses,
    }
  }


  //step 6 - send it
  console.log('before sending,', pleaseWork.buf)
  const writer = await writeAll(conn, pleaseWork.buf);
  const tempBuf = new Uint8Array(100);
  const dcd = new TextDecoder()
  //READ INTO THE BUFFER - THE ARGUMENT IS THE DESTINATION, CALL READ ON THE CONNECTION
  await conn.read(tempBuf);
  console.log('response:', tempBuf)
  console.log('decoded', dcd.decode(tempBuf))

}

func();