// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'crc32C'.
const crc32C = require('./index')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > RecordBatch > crc32C', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('perform CRC32C computations', () => {
    const longString =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mollis cursus metus vel tristique. Proin congue massa massa, a malesuada dolor ullamcorper a. Nulla eget leo vel orci venenatis placerat. Donec semper condimentum justo, vel sollicitudin dolor consequat id. Nunc sed aliquet felis, eget congue nisi. Mauris eu justo suscipit, elementum turpis ut, molestie tellus. Mauris ornare rutrum fringilla. Nulla dignissim luctus pretium. Nullam nec eros hendrerit sapien pellentesque sollicitudin. Integer eget ligula dui. Mauris nec cursus nibh. Nunc interdum elementum leo, eu sagittis eros sodales nec. Duis dictum nulla sed tincidunt malesuada. Quisque in vulputate sapien. Sed sit amet tellus a est porta rhoncus sed eu metus. Mauris non pulvinar nisl, volutpat luctus enim. Suspendisse est nisi, sagittis at risus quis, ultricies rhoncus sem. Donec ullamcorper purus eget sapien facilisis, eu eleifend felis viverra. Suspendisse elit neque, semper aliquet neque sed, egestas tempus leo. Duis condimentum turpis duis.'
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const buffer = Buffer.from(longString)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(crc32C(buffer)).toEqual(1796588439)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('match the java CRC32C code', () => {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const buffer = Buffer.from(require('./fixtures/crcPayload.json'))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(crc32C(buffer)).toEqual(818496390)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('samples', () => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const samples = require('./fixtures/samples')
    for (const sample of samples) {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      const buffer = Buffer.from(sample.input)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(crc32C(buffer)).toEqual(sample.output)
    }
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('empty', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(crc32C(Buffer.alloc(0))).toEqual(0)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('unicode null', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(crc32C(Buffer.from('\u0000'))).toEqual(1383945041)
  })
})
