// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Long'.
import Long from '../../utils/long'
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
import Decoder from '../decoder'
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MessageDec... Remove this comment to see the full error message
import MessageDecoder from '../message/decoder'
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'lookupCode... Remove this comment to see the full error message
import { lookupCodecByAttributes } from '../message/compression'
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSPar... Remove this comment to see the full error message
import { KafkaJSPartialMessageError } from '../../errors'

/**
 * MessageSet => [Offset MessageSize Message]
 *  Offset => int64
 *  MessageSize => int32
 *  Message => Bytes
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export default async (primaryDecoder: any, size = null) => {
  const messages = []
  const messageSetSize = size || primaryDecoder.readInt32()
  const messageSetDecoder = primaryDecoder.slice(messageSetSize)

  while (messageSetDecoder.offset < messageSetSize) {
    try {
      const message = EntryDecoder(messageSetDecoder)
      const codec = lookupCodecByAttributes(message.attributes)

      if (codec) {
        const buffer = await codec.decompress(message.value)
        messages.push(...EntriesDecoder(new Decoder(buffer), message))
      } else {
        messages.push(message)
      }
    } catch (e) {
      if (e.name === 'KafkaJSPartialMessageError') {
        // We tried to decode a partial message, it means that minBytes
        // is probably too low
        break
      }

      if (e.name === 'KafkaJSUnsupportedMagicByteInMessageSet') {
        // Received a MessageSet and a RecordBatch on the same response, the cluster is probably
        // upgrading the message format from 0.10 to 0.11. Stop processing this message set to
        // receive the full record batch on the next request
        break
      }

      throw e
    }
  }

  primaryDecoder.forward(messageSetSize)
  return messages
}

const EntriesDecoder = (decoder: any, compressedMessage: any) => {
  const messages = []

  while (decoder.offset < decoder.buffer.length) {
    messages.push(EntryDecoder(decoder))
  }

  if (compressedMessage.magicByte > 0 && compressedMessage.offset >= 0) {
    const compressedOffset = Long.fromValue(compressedMessage.offset)
    const lastMessageOffset = Long.fromValue(messages[messages.length - 1].offset)
    const baseOffset = compressedOffset - lastMessageOffset

    for (const message of messages) {
      message.offset = Long.fromValue(message.offset)
        .add(baseOffset)
        .toString()
    }
  }

  return messages
}

const EntryDecoder = (decoder: any) => {
  if (!decoder.canReadInt64()) {
    throw new KafkaJSPartialMessageError(
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
      `Tried to decode a partial message: There isn't enough bytes to read the offset`
    )
  }

  const offset = decoder.readInt64().toString()

  if (!decoder.canReadInt32()) {
    throw new KafkaJSPartialMessageError(
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
      `Tried to decode a partial message: There isn't enough bytes to read the message size`
    )
  }

  const size = decoder.readInt32()
  return MessageDecoder(offset, size, decoder)
}
