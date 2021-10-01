// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
import Encoder from '../../../encoder'

/**
 * v0
 * Header => Key Value
 *   Key => varInt|string
 *   Value => varInt|bytes
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export default({
 key,
 value
}: any) => {
  return new Encoder().writeVarIntString(key).writeVarIntBytes(value)
}
