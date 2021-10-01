// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export default (decoder: any) => ({
  attributes: decoder.readInt8(),
  key: decoder.readBytes(),
  value: decoder.readBytes()
})
