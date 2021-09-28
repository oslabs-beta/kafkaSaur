/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "_" }] */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')

const ENTRY_REGEX = /^([rsiev])=(.*)$/

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  decode: async (rawData: any) => {
    return new Decoder(rawData).readBytes()
  },
  parse: async (data: any) => {
    const processed = data
      .toString()
      .split(',')
      .map((str: any) => {
        const [_, key, value] = str.match(ENTRY_REGEX)
        return [key, value]
      })
      // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'obj' implicitly has an 'any' type.
      .reduce((obj, entry) => ({
      ...obj,
      [entry[0]]: entry[1]
    }), {})

    return { original: data.toString(), ...processed }
  },
}
