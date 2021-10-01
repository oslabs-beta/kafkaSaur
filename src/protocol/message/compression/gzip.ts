import { promisify } from 'util'
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
import zlib from 'https://deno.land/x/compress@v0.3.3/zlib';

const gzip = promisify(zlib.gzip)
const unzip = promisify(zlib.unzip)

//encoder type??
const methods = {
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

export default methods;

// export {
//   /**
//    * @param {Encoder} encoder
//    * @returns {Promise}
//    */
//   async compress(encoder) {
//     return await gzip(encoder.buffer)
//   },

//   /**
//    * @param {Buffer} buffer
//    * @returns {Promise}
//    */
//   async decompress(buffer: any) {
//     return await unzip(buffer)
//   },
// }
