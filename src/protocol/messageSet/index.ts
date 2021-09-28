// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../encoder')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const MessageProtocol = require('../message')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Types'.
const { Types } = require('../message/compression')

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
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
 messageVersion = 0,
 compression,
 entries
}: any) => {
  const isCompressed = compression !== Types.None
  const Message = MessageProtocol({ version: messageVersion })
  const encoder = new Encoder()

  // Messages in a message set are __not__ encoded as an array.
  // They are written in sequence.
  // https://cwiki.apache.org/confluence/display/KAFKA/A+Guide+To+The+Kafka+Protocol#AGuideToTheKafkaProtocol-Messagesets

  entries.forEach((entry: any, i: any) => {
    const message = Message(entry)

    // This is the offset used in kafka as the log sequence number.
    // When the producer is sending non compressed messages, it can set the offsets to anything
    // When the producer is sending compressed messages, to avoid server side recompression, each compressed message
    // should have offset starting from 0 and increasing by one for each inner message in the compressed message
    encoder.writeInt64(isCompressed ? i : -1)
    encoder.writeInt32(message.size())

    encoder.writeEncoder(message)
  })

  return encoder
}
