import {Decoder} from '../../decoder.ts'

export default (decoder: Decoder) => ({
  attributes: decoder.readInt8(),
  key: decoder.readBytes(),
  value: decoder.readBytes()
})
