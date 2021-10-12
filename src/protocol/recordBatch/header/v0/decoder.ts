export default (decoder: any) => ({
  key: decoder.readVarIntString(),
  value: decoder.readVarIntBytes()
})
