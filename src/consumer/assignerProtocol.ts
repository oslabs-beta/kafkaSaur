/** @format */

import { Encoder } from '../protocol/encoder.ts';
import { Decoder } from '../protocol/decoder.ts';
import { Buffer } from 'https://deno.land/std@0.110.0/node/buffer.ts';

const MemberMetadata = {
  /**
   * @param {Object} metadata
   * @param {number} metadata.version
   * @param {Array<string>} metadata.topics
   * @param {Buffer} [metadata.userData=Buffer.alloc(0)]
   *
   * @returns Buffer
   */
  encode({ version, topics, userData = Buffer.alloc(0) }: any) {
    return new Encoder()
      .writeInt16(version)
      .writeArray(topics)
      .writeBytes(userData).buffer;
  },

  /**
   * @param {Buffer} buffer
   * @returns {Object}
   */
  decode(buffer: any) {
    const decoder = new Decoder(buffer);
    return {
      version: decoder.readInt16(),
      topics: decoder.readArray((d: any) => d.readString()),
      userData: decoder.readBytes(),
    };
  },
};

const MemberAssignment = {
  /**
   * @param {number} version
   * @param {Object<String,Array>} assignment, example:
   *                               {
   *                                 'topic-A': [0, 2, 4, 6],
   *                                 'topic-B': [0, 2],
   *                               }
   * @param {Buffer} [userData=Buffer.alloc(0)]
   *
   * @returns Buffer
   */
  encode({ version, assignment, userData = Buffer.alloc(0) }: any) {
    return new Encoder()
      .writeInt16(version)
      .writeArray(
        Object.keys(assignment).map((topic) =>
          new Encoder().writeString(topic).writeArray(assignment[topic])
        )
      )
      .writeBytes(userData).buffer;
  },

  /**
   * @param {Buffer} buffer
   * @returns {Object|null}
   */
  decode(buffer: any) {
    const decoder = new Decoder(buffer);
    const decodePartitions = (d: any) => d.readInt32();
    const decodeAssignment = (d: any) => ({
      topic: d.readString(),
      partitions: d.readArray(decodePartitions),
    });
    const indexAssignment = (obj: any, { topic, partitions }: any) =>
      Object.assign(obj, { [topic]: partitions });

    if (!decoder.canReadInt16()) {
      return null;
    }

    return {
      version: decoder.readInt16(),
      assignment: decoder
        .readArray(decodeAssignment)
        .reduce(indexAssignment, {}),
      userData: decoder.readBytes(),
    };
  },
};

export { MemberMetadata, MemberAssignment };
