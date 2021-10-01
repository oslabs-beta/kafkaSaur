// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isInvalidO... Remove this comment to see the full error message
const isInvalidOffset = require('../isInvalidOffset')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer > OffsetMananger > isInvalidOffset', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('returns true for negative offsets', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isInvalidOffset(-1)).toEqual(true)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isInvalidOffset('-1')).toEqual(true)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isInvalidOffset(-2)).toEqual(true)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isInvalidOffset('-3')).toEqual(true)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('returns true for blank values', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isInvalidOffset(null)).toEqual(true)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isInvalidOffset(undefined)).toEqual(true)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isInvalidOffset('')).toEqual(true)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('returns false for positive offsets', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isInvalidOffset(0)).toEqual(false)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isInvalidOffset(1)).toEqual(false)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isInvalidOffset('2')).toEqual(false)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isInvalidOffset('3')).toEqual(false)
  })
})
