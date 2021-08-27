export const V0Decoder = (decoder) => ({
  attributes: decoder.readInt8(),
  key: decoder.readBytes(),
  value: decoder.readBytes(),
})

