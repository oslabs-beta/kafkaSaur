// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../protocol/encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../protocol/decoder')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MemberMeta... Remove this comment to see the full error message
const MemberMetadata = {
  /**
   * @param {Object} metadata
   * @param {number} metadata.version
   * @param {Array<string>} metadata.topics
   * @param {Buffer} [metadata.userData=Buffer.alloc(0)]
   *
   * @returns Buffer
   */
  encode({
    version,
    topics,
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    userData = Buffer.alloc(0)
  }: any) {
    return new Encoder()
      .writeInt16(version)
      .writeArray(topics)
      .writeBytes(userData).buffer
  },

  /**
   * @param {Buffer} buffer
   * @returns {Object}
   */
  decode(buffer: any) {
    const decoder = new Decoder(buffer)
    return {
      version: decoder.readInt16(),
      topics: decoder.readArray((d: any) => d.readString()),
      userData: decoder.readBytes(),
    };
  },
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MemberAssi... Remove this comment to see the full error message
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
  encode({
    version,
    assignment,
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    userData = Buffer.alloc(0)
  }: any) {
    return new Encoder()
      .writeInt16(version)
      .writeArray(
        Object.keys(assignment).map(topic =>
          new Encoder().writeString(topic).writeArray(assignment[topic])
        )
      )
      .writeBytes(userData).buffer
  },

  /**
   * @param {Buffer} buffer
   * @returns {Object|null}
   */
  decode(buffer: any) {
    const decoder = new Decoder(buffer)
    const decodePartitions = (d: any) => d.readInt32()
    const decodeAssignment = (d: any) => ({
      topic: d.readString(),
      partitions: d.readArray(decodePartitions)
    })
    const indexAssignment = (obj: any, {
      topic,
      partitions
    }: any) =>
      // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
      Object.assign(obj, { [topic]: partitions })

    if (!decoder.canReadInt16()) {
      return null
    }

    return {
      version: decoder.readInt16(),
      assignment: decoder.readArray(decodeAssignment).reduce(indexAssignment, {}),
      userData: decoder.readBytes(),
    }
  },
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export {
  MemberMetadata,
  MemberAssignment,
}
