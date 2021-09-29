// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'shuffle'.
import shuffle from './shuffle'

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Utils > shuffle', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('shuffles', () => {
    const array = Array(500)
      // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
      .fill()
      .map((_: any, i: any) => i)
    const shuffled = shuffle(array)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(shuffled).not.toEqual(array)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(shuffled).toIncludeSameMembers(array)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('returns the same order for single element arrays', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(shuffle([1])).toEqual([1])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws if it receives a non-array', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(() => shuffle()).toThrowError(TypeError)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(() => shuffle('foo')).toThrowError(TypeError)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(() => shuffle({})).toThrowError(TypeError)
  })
})
