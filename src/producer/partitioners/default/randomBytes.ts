
import {KafkaJSNonRetriableError} from '../../../errors.ts'

const toNodeCompatible = (crypto: any) => ({
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
  randomBytes: (size: any) => crypto.getRandomValues(Buffer.allocUnsafe(size))
})

let cryptoImplementation: any = null
// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'global'. Did you mean 'glob'?
if (global && global.crypto) {
  cryptoImplementation =
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'global'. Did you mean 'glob'?
    global.crypto.randomBytes === undefined ? toNodeCompatible(global.crypto) : global.crypto
// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'global'. Did you mean 'glob'?
} else if (global && global.msCrypto) {
  // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'global'. Did you mean 'glob'?
  cryptoImplementation = toNodeCompatible(global.msCrypto)
// @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'global'. Did you mean 'glob'?
} else if (global && !global.crypto) {
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  cryptoImplementation = require('crypto')
}

const MAX_BYTES = 65536

export default (size: any) => {
  if (size > MAX_BYTES) {
    throw new KafkaJSNonRetriableError(
      `Byte length (${size}) exceeds the max number of bytes of entropy available (${MAX_BYTES})`
    )
  }

  if (!cryptoImplementation) {
    throw new KafkaJSNonRetriableError('No available crypto implementation')
  }

  return cryptoImplementation.randomBytes(size)
}
