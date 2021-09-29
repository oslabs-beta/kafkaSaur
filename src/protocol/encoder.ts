// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Long'.
import {Long} from '../utils/long'

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'INT8_SIZE'... Remove this comment to see the full error message
const INT8_SIZE = 1
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'INT16_SIZE... Remove this comment to see the full error message
const INT16_SIZE = 2
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'INT32_SIZE... Remove this comment to see the full error message
const INT32_SIZE = 4
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'INT64_SIZE... Remove this comment to see the full error message
const INT64_SIZE = 8
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DOUBLE_SIZ... Remove this comment to see the full error message
const DOUBLE_SIZE = 8

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MOST_SIGNI... Remove this comment to see the full error message
const MOST_SIGNIFICANT_BIT = 0x80 // 128
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'OTHER_BITS... Remove this comment to see the full error message
const OTHER_BITS = 0x7f // 127
const UNSIGNED_INT32_MAX_NUMBER = 0xffffff80
// @ts-expect-error ts-migrate(2737) FIXME: BigInt literals are not available when targeting l... Remove this comment to see the full error message
const UNSIGNED_INT64_MAX_NUMBER = 0xffffffffffffff80n

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export class Encoder {
  buf: any;
  offset: any;
  static encodeZigZag(value: any) {
    return (value << 1) ^ (value >> 31)
  }

  static encodeZigZag64(value: any) {
    const longValue = Long.fromValue(value)
    return longValue.shiftLeft(1).xor(longValue.shiftRight(63))
  }

  static sizeOfVarInt(value: any) {
    let encodedValue = this.encodeZigZag(value)
    let bytes = 1

    while ((encodedValue & UNSIGNED_INT32_MAX_NUMBER) !== 0) {
      bytes += 1
      encodedValue >>>= 7
    }

    return bytes
  }

  static sizeOfVarLong(value: any) {
    let longValue = Encoder.encodeZigZag64(value)
    let bytes = 1

    while (longValue.and(UNSIGNED_INT64_MAX_NUMBER).notEquals(Long.fromInt(0))) {
      bytes += 1
      longValue = longValue.shiftRightUnsigned(7)
    }

    return bytes
  }

  static sizeOfVarIntBytes(value: any) {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const size = value == null ? -1 : Buffer.byteLength(value)

    if (size < 0) {
      return Encoder.sizeOfVarInt(-1)
    }

    return Encoder.sizeOfVarInt(size) + size
  }

  static nextPowerOfTwo(value: any) {
    // @ts-expect-error ts-migrate(2550) FIXME: Property 'clz32' does not exist on type 'Math'. Do... Remove this comment to see the full error message
    return 1 << (31 - Math.clz32(value) + 1)
  }

  /**
   * Construct a new encoder with the given initial size
   *
   * @param {number} [initialSize] initial size
   */
  constructor(initialSize = 511) {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    this.buf = Buffer.alloc(Encoder.nextPowerOfTwo(initialSize))
    this.offset = 0
  }

  /**
   * @param {Buffer} buffer
   */
  writeBufferInternal(buffer: any) {
    const bufferLength = buffer.length
    this.ensureAvailable(bufferLength)
    buffer.copy(this.buf, this.offset, 0)
    this.offset += bufferLength
  }

  ensureAvailable(length: any) {
    if (this.offset + length > this.buf.length) {
      const newLength = Encoder.nextPowerOfTwo(this.offset + length)
      // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
      const newBuffer = Buffer.alloc(newLength)
      this.buf.copy(newBuffer, 0, 0, this.offset)
      this.buf = newBuffer
    }
  }

  get buffer() {
    return this.buf.slice(0, this.offset)
  }

  writeInt8(value: any) {
    this.ensureAvailable(INT8_SIZE)
    this.buf.writeInt8(value, this.offset)
    this.offset += INT8_SIZE
    return this
  }

  writeInt16(value: any) {
    this.ensureAvailable(INT16_SIZE)
    this.buf.writeInt16BE(value, this.offset)
    this.offset += INT16_SIZE
    return this
  }

  writeInt32(value: any) {
    this.ensureAvailable(INT32_SIZE)
    this.buf.writeInt32BE(value, this.offset)
    this.offset += INT32_SIZE
    return this
  }

  writeUInt32(value: any) {
    this.ensureAvailable(INT32_SIZE)
    this.buf.writeUInt32BE(value, this.offset)
    this.offset += INT32_SIZE
    return this
  }

  writeInt64(value: any) {
    this.ensureAvailable(INT64_SIZE)
    const longValue = Long.fromValue(value)
    this.buf.writeInt32BE(longValue.getHighBits(), this.offset)
    this.buf.writeInt32BE(longValue.getLowBits(), this.offset + INT32_SIZE)
    this.offset += INT64_SIZE
    return this
  }

  writeDouble(value: any) {
    this.ensureAvailable(DOUBLE_SIZE)
    this.buf.writeDoubleBE(value, this.offset)
    this.offset += DOUBLE_SIZE
    return this
  }

  writeBoolean(value: any) {
    value ? this.writeInt8(1) : this.writeInt8(0)
    return this
  }

  writeString(value: any) {
    if (value == null) {
      this.writeInt16(-1)
      return this
    }

    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const byteLength = Buffer.byteLength(value, 'utf8')
    this.ensureAvailable(INT16_SIZE + byteLength)
    this.writeInt16(byteLength)
    this.buf.write(value, this.offset, byteLength, 'utf8')
    this.offset += byteLength
    return this
  }

  writeVarIntString(value: any) {
    if (value == null) {
      this.writeVarInt(-1)
      return this
    }

    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const byteLength = Buffer.byteLength(value, 'utf8')
    this.writeVarInt(byteLength)
    this.ensureAvailable(byteLength)
    this.buf.write(value, this.offset, byteLength, 'utf8')
    this.offset += byteLength
    return this
  }

  writeUVarIntString(value: any) {
    if (value == null) {
      this.writeUVarInt(0)
      return this
    }

    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const byteLength = Buffer.byteLength(value, 'utf8')
    this.writeUVarInt(byteLength + 1)
    this.ensureAvailable(byteLength)
    this.buf.write(value, this.offset, byteLength, 'utf8')
    this.offset += byteLength
    return this
  }

  writeBytes(value: any) {
    if (value == null) {
      this.writeInt32(-1)
      return this
    }

    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    if (Buffer.isBuffer(value)) {
      // raw bytes
      this.ensureAvailable(INT32_SIZE + value.length)
      this.writeInt32(value.length)
      this.writeBufferInternal(value)
    } else {
      const valueToWrite = String(value)
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      const byteLength = Buffer.byteLength(valueToWrite, 'utf8')
      this.ensureAvailable(INT32_SIZE + byteLength)
      this.writeInt32(byteLength)
      this.buf.write(valueToWrite, this.offset, byteLength, 'utf8')
      this.offset += byteLength
    }

    return this
  }

  writeVarIntBytes(value: any) {
    if (value == null) {
      this.writeVarInt(-1)
      return this
    }

    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
    if (Buffer.isBuffer(value)) {
      // raw bytes
      this.writeVarInt(value.length)
      this.writeBufferInternal(value)
    } else {
      const valueToWrite = String(value)
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      const byteLength = Buffer.byteLength(valueToWrite, 'utf8')
      this.writeVarInt(byteLength)
      this.ensureAvailable(byteLength)
      this.buf.write(valueToWrite, this.offset, byteLength, 'utf8')
      this.offset += byteLength
    }

    return this
  }

  writeUVarIntBytes(value: any) {
    if (value == null) {
      this.writeVarInt(0)
      return this
    }

    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
    if (Buffer.isBuffer(value)) {
      // raw bytes
      this.writeUVarInt(value.length + 1)
      this.writeBufferInternal(value)
    } else {
      const valueToWrite = String(value)
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      const byteLength = Buffer.byteLength(valueToWrite, 'utf8')
      this.writeUVarInt(byteLength + 1)
      this.ensureAvailable(byteLength)
      this.buf.write(valueToWrite, this.offset, byteLength, 'utf8')
      this.offset += byteLength
    }

    return this
  }

  writeEncoder(value: any) {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
    if (value == null || !Buffer.isBuffer(value.buf)) {
      throw new Error('value should be an instance of Encoder')
    }

    this.writeBufferInternal(value.buffer)
    return this
  }

  writeEncoderArray(value: any) {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
    if (!Array.isArray(value) || value.some(v => v == null || !Buffer.isBuffer(v.buf))) {
      throw new Error('all values should be an instance of Encoder[]')
    }

    value.forEach(v => {
      this.writeBufferInternal(v.buffer)
    })
    return this
  }

  writeBuffer(value: any) {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
    if (!Buffer.isBuffer(value)) {
      throw new Error('value should be an instance of Buffer')
    }

    this.writeBufferInternal(value)
    return this
  }

  /**
   * @param {any[]} array
   * @param {'int32'|'number'|'string'|'object'} [type]
   */
  writeNullableArray(array: any, type: any) {
    // A null value is encoded with length of -1 and there are no following bytes
    // On the context of this library, empty array and null are the same thing
    const length = array.length !== 0 ? array.length : -1
    this.writeArray(array, type, length)
    return this
  }

  /**
   * @param {any[]} array
   * @param {'int32'|'number'|'string'|'object'} [type]
   * @param {number} [length]
   */
  writeArray(array: any, type: any, length: any) {
    const arrayLength = length == null ? array.length : length
    this.writeInt32(arrayLength)
    if (type !== undefined) {
      switch (type) {
        case 'int32':
        case 'number':
          array.forEach((value: any) => this.writeInt32(value))
          break
        case 'string':
          array.forEach((value: any) => this.writeString(value))
          break
        case 'object':
          this.writeEncoderArray(array)
          break
      }
    } else {
      array.forEach((value: any) => {
        switch (typeof value) {
          case 'number':
            this.writeInt32(value)
            break
          case 'string':
            this.writeString(value)
            break
          case 'object':
            this.writeEncoder(value)
            break
        }
      })
    }
    return this
  }

  writeVarIntArray(array: any, type: any) {
    if (type === 'object') {
      this.writeVarInt(array.length)
      this.writeEncoderArray(array)
    } else {
      const objectArray = array.filter((v: any) => typeof v === 'object')
      this.writeVarInt(objectArray.length)
      this.writeEncoderArray(objectArray)
    }
    return this
  }

  writeUVarIntArray(array: any, type: any) {
    if (type === 'object') {
      this.writeUVarInt(array.length + 1)
      this.writeEncoderArray(array)
    } else {
      const objectArray = array.filter((v: any) => typeof v === 'object')
      this.writeUVarInt(objectArray.length + 1)
      this.writeEncoderArray(objectArray)
    }
    return this
  }

  // Based on:
  // https://en.wikipedia.org/wiki/LEB128 Using LEB128 format similar to VLQ.
  // https://github.com/addthis/stream-lib/blob/master/src/main/java/com/clearspring/analytics/util/Varint.java#L106
  writeVarInt(value: any) {
    return this.writeUVarInt(Encoder.encodeZigZag(value))
  }

  writeUVarInt(value: any) {
    const byteArray = []
    while ((value & UNSIGNED_INT32_MAX_NUMBER) !== 0) {
      byteArray.push((value & OTHER_BITS) | MOST_SIGNIFICANT_BIT)
      value >>>= 7
    }
    byteArray.push(value & OTHER_BITS)
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
    this.writeBufferInternal(Buffer.from(byteArray))
    return this
  }

  writeVarLong(value: any) {
    const byteArray = []
    let longValue = Encoder.encodeZigZag64(value)

    while (longValue.and(UNSIGNED_INT64_MAX_NUMBER).notEquals(Long.fromInt(0))) {
      byteArray.push(
        longValue
          .and(OTHER_BITS)
          .or(MOST_SIGNIFICANT_BIT)
          .toInt()
      )
      longValue = longValue.shiftRightUnsigned(7)
    }

    byteArray.push(longValue.toInt())

    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
    this.writeBufferInternal(Buffer.from(byteArray))
    return this
  }

  size() {
    // We can use the offset here directly, because we anyways will not re-encode the buffer when writing
    return this.offset
  }

  toJSON() {
    return this.buffer.toJSON()
  }
}
