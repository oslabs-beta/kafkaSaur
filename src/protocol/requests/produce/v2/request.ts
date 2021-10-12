/** @format */

import { Encoder } from '../../../encoder.ts';
import apiKeys from '../../apiKeys.ts';
import MessageSet from '../../../messageSet/index.ts';
import compression from '../../../message/compression/index.ts';

const { Types } = compression;
const { lookupCodec } = compression;

const apiKey = apiKeys.Produce;

// Produce Request on or after v2 indicates the client can parse the timestamp field
// in the produce Response.

export default ({
  acks,
  timeout,
  compression = Types.None,
  topicData,
}: any) => ({
  apiKey,
  apiVersion: 2,
  apiName: 'Produce',
  expectResponse: () => acks !== 0,
  encode: async () => {
    const encodeTopic = topicEncoder(compression);
    const encodedTopicData = [];

    for (const data of topicData) {
      encodedTopicData.push(await encodeTopic(data));
    }

    return new Encoder()
      .writeInt16(acks)
      .writeInt32(timeout)
      .writeArray(encodedTopicData);
  },
});

const topicEncoder = (compression: any) => {
  const encodePartitions = partitionsEncoder(compression);

  return async ({ topic, partitions }: any) => {
    const encodedPartitions = [];

    for (const data of partitions) {
      encodedPartitions.push(await encodePartitions(data));
    }

    return new Encoder().writeString(topic).writeArray(encodedPartitions);
  };
};

const partitionsEncoder =
  (compression: any) =>
  async ({ partition, messages }: any) => {
    const messageSet = MessageSet({
      messageVersion: 1,
      compression,
      entries: messages,
    });

    if (compression === Types.None) {
      return new Encoder()
        .writeInt32(partition)
        .writeInt32(messageSet.size())
        .writeEncoder(messageSet);
    }

    const timestamp = messages[0].timestamp || Date.now();

    const codec: any = lookupCodec(compression);
    const compressedValue = await codec.compress(messageSet);
    const compressedMessageSet = MessageSet({
      messageVersion: 1,
      entries: [{ compression, timestamp, value: compressedValue }],
    });

    return new Encoder()
      .writeInt32(partition)
      .writeInt32(compressedMessageSet.size())
      .writeEncoder(compressedMessageSet);
  };
