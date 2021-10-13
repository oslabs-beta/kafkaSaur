/** @format */

// /** @format */

// import { KafkaJSNonRetriableError } from '../../../errors.ts';
// import { Buffer } from 'https://deno.land/std@0.110.0/node/buffer.ts';
// import crypto from 'https://deno.land/std@0.110.0/node/crypto.ts';
// import * as global from 'https://deno.land/std@0.110.0/node/global.ts';

// const toNodeCompatible = (crypto: any) => ({
//   randomBytes: (size: number) =>
//     crypto.getRandomValues(Buffer.allocUnsafe(size)),
// });

// let cryptoImplementation: any = null;
// if (global && global.crypto) {
//   cryptoImplementation =
//     global.crypto.randomBytes === undefined
//       ? toNodeCompatible(global.crypto)
//       : global.crypto;
// } else if (global && global.msCrypto) {
//   cryptoImplementation = toNodeCompatible(global.msCrypto);
// } else if (global && !global.crypto) {
//   cryptoImplementation = crypto;
// }

// const MAX_BYTES = 65536;

// export default (size: number) => {
//   if (size > MAX_BYTES) {
//     throw new KafkaJSNonRetriableError(
//       `Byte length (${size}) exceeds the max number of bytes of entropy available (${MAX_BYTES})`
//     );
//   }

//   if (!cryptoImplementation) {
//     throw new KafkaJSNonRetriableError('No available crypto implementation');
//   }

//   return cryptoImplementation.randomBytes(size);
// };
