import {Decoder} from '../../../decoder.ts'
import MessageSetDecoder from '../../../messageSet/decoder.ts'
import RecordBatchDecoder from '../../../recordBatch/v0/decoder.ts'
import { MAGIC_BYTE } from '../../../recordBatch/v0/index.ts'

// the magic offset is at the same offset for all current message formats, but the 4 bytes
// between the size and the magic is dependent on the version.
const MAGIC_OFFSET = 16
const RECORD_BATCH_OVERHEAD = 49

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
      } catch (e:any) {
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

export default decodeMessages
