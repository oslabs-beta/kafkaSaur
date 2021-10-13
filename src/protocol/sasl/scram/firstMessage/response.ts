/**
 * /* eslint no-unused-vars: ["error", { "varsIgnorePattern": "_" }]
 *
 * @format
 */

import { Decoder } from '../../../decoder.ts';

const ENTRY_REGEX = /^([rsiev])=(.*)$/;

export default {
  //@ts-ignore
  decode: async (rawData: any) => {
    return new Decoder(rawData).readBytes();
  },
  parse: async (data: any) => {
    const processed = data
      .toString()
      .split(',')
      .map((str: any) => {
        const [_, key, value] = str.match(ENTRY_REGEX);
        return [key, value];
      })
      .reduce(
        (obj: any, entry: any) => ({
          ...obj,
          [entry[0]]: entry[1],
        }),
        {}
      );

    return { original: data.toString(), ...processed };
  },
};
