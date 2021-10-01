import { promisify } from '../../../utils/promisify.ts'
import zlib from 'https://deno.land/x/compress@v0.3.3/zlib';
import { Buffer } from 'https://deno.land/std@0.76.0/node/buffer.ts';
import { Encoder } from '../../encoder.ts'

const gzip = promisify(zlib.gzip)
const unzip = promisify(zlib.unzip)

const methods = {
  async compress(encoder: Encoder) {
    return await gzip(encoder.buffer)
  },

  /**
   * @param {Buffer} buffer
   * @returns {Promise}
   */
  async decompress(buffer: Buffer) {
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
