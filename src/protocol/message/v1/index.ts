// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
import Encoder from '../../encoder'
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'crc32'.
import crc32 from '../../crc32'
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Compressio... Remove this comment to see the full error message
import { Types as Compression, COMPRESSION_CODEC_MASK } from '../compression'

/**
 * v1 (supported since 0.10.0)
 * Message => Crc MagicByte Attributes Key Value
 *   Crc => int32
 *   MagicByte => int8
 *   Attributes => int8
 *   Timestamp => int64
 *   Key => bytes
 *   Value => bytes
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  compression = Compression.None,
  timestamp = Date.now(),
  key,
  value
}: any) => {
  const content = new Encoder()
    .writeInt8(1) // magicByte
    .writeInt8(compression & COMPRESSION_CODEC_MASK)
    .writeInt64(timestamp)
    .writeBytes(key)
    .writeBytes(value)

  const crc = crc32(content)
  return new Encoder().writeInt32(crc).writeEncoder(content)
}
