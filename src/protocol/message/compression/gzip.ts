/** @format */

import { promisify } from '../../../utils/promisify.ts';
import { gzip, gunzip } from 'https://deno.land/x/compress@v0.3.3/mod.ts';
import { Buffer } from 'https://deno.land/std@0.110.0/node/buffer.ts';
import { Encoder } from '../../encoder.ts';

const KafkaGzip: any = promisify(gzip);
const unzip: any = promisify(gunzip);

const methods = {
  async compress(encoder: Encoder) {
    return await KafkaGzip(encoder.buffer);
  },

  /**
   * @param {Buffer} buffer
   * @returns {Promise}
   */
  async decompress(buffer: Buffer) {
    return await unzip(buffer);
  },
};

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
