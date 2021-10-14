import { Encoder } from '../../../encoder.ts'

/**
 * v0
 * Header => Key Value
 *   Key => varInt|string
 *   Value => varInt|bytes
 */

export default({
 key,
 value
}: any) => {
  return new Encoder().writeVarIntString(key).writeVarIntBytes(value)
}
