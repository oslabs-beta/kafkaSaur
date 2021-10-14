/** @format */

import { Encoder } from '../../../encoder.ts';

export default ({ finalMessage }: any) => ({
  encode: async () => new Encoder().writeBytes(finalMessage),
});
