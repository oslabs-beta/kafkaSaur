// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
import { promisify } from 'util'
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const zlib = require('zlib')

const gzip = promisify(zlib.gzip)
const unzip = promisify(zlib.unzip)

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export {
  /**
   * @param {Encoder} encoder
   * @returns {Promise}
   */
  async compress(encoder: any) {
    return await gzip(encoder.buffer)
  },

  /**
   * @param {Buffer} buffer
   * @returns {Promise}
   */
  async decompress(buffer: any) {
    return await unzip(buffer)
  },
}
