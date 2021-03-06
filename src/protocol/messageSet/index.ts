/** @format */

import { Encoder } from '../encoder.ts';
import MessageProtocol from '../message/index.ts';
import Compression from '../message/compression/index.ts';

const { Types } = Compression;
/**
 * MessageSet => [Offset MessageSize Message]
 *  Offset => int64
 *  MessageSize => int32
 *  Message => Bytes
 */

/**
 * [
 *   { key: "<value>", value: "<value>" },
 *   { key: "<value>", value: "<value>" },
 * ]
 */
export default ({ messageVersion = 0, compression, entries }: any) => {
  const isCompressed = compression !== Types.None;
  const Message = MessageProtocol({ version: messageVersion });
  const encoder = new Encoder();

  // Messages in a message set are __not__ encoded as an array.
  // They are written in sequence.
  // https://cwiki.apache.org/confluence/display/KAFKA/A+Guide+To+The+Kafka+Protocol#AGuideToTheKafkaProtocol-Messagesets

  entries.forEach((entry: any, i: any) => {
    const message = Message(entry);

    // This is the offset used in kafka as the log sequence number.
    // When the producer is sending non compressed messages, it can set the offsets to anything
    // When the producer is sending compressed messages, to avoid server side recompression, each compressed message
    // should have offset starting from 0 and increasing by one for each inner message in the compressed message
    encoder.writeInt64(isCompressed ? i : -1);
    encoder.writeInt32(message.size());

    encoder.writeEncoder(message);
  });

  return encoder;
};
