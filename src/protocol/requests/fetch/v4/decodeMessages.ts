// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MessageSet... Remove this comment to see the full error message
const MessageSetDecoder = require('../../../messageSet/decoder')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const RecordBatchDecoder = require('../../../recordBatch/v0/decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MAGIC_BYTE... Remove this comment to see the full error message
const { MAGIC_BYTE } = require('../../../recordBatch/v0')

// the magic offset is at the same offset for all current message formats, but the 4 bytes
// between the size and the magic is dependent on the version.
const MAGIC_OFFSET = 16
const RECORD_BATCH_OVERHEAD = 49

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decodeMess... Remove this comment to see the full error message
const decodeMessages = async (decoder: any) => {
  const messagesSize = decoder.readInt32()

  if (messagesSize <= 0 || !decoder.canReadBytes(messagesSize)) {
    return []
  }

  const messagesBuffer = decoder.readBytes(messagesSize)
  const messagesDecoder = new Decoder(messagesBuffer)
  const magicByte = messagesBuffer.slice(MAGIC_OFFSET).readInt8(0)

  if (magicByte === MAGIC_BYTE) {
    const records = []

    while (messagesDecoder.canReadBytes(RECORD_BATCH_OVERHEAD)) {
      try {
        const recordBatch = await RecordBatchDecoder(messagesDecoder)
        records.push(...recordBatch.records)
      } catch (e) {
        // The tail of the record batches can have incomplete records
        // due to how maxBytes works. See https://cwiki.apache.org/confluence/display/KAFKA/A+Guide+To+The+Kafka+Protocol#AGuideToTheKafkaProtocol-FetchAPI
        if (e.name === 'KafkaJSPartialMessageError') {
          break
        }

        throw e
      }
    }

    return records
  }

  return MessageSetDecoder(messagesDecoder, messagesSize)
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = decodeMessages
