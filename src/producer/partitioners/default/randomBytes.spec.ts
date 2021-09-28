// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSNon... Remove this comment to see the full error message
const { KafkaJSNonRetriableError } = require('../../../errors')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'randomByte... Remove this comment to see the full error message
const randomBytes = require('./randomBytes')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Producer > Partitioner > Default > RandomBytes', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('it throws when requesting more bytes than entry allows', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(() => randomBytes(65537)).toThrowError(
      new KafkaJSNonRetriableError(
        'Byte length (65537) exceeds the max number of bytes of entropy available (65536)'
      )
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('it returns random bytes of the desired length', () => {
    const bytes = randomBytes(32)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(bytes).toEqual(expect.any(Buffer))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(bytes.byteLength).toBe(32)
  })
})
