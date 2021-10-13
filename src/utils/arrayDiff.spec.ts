import arrayDiff from './arrayDiff'

describe('Utils > arrayDiff', () => {
  it('returns the elements in A that are not in B', () => {
    const a = [1, 2, 3, 4]
    const b = [2, 3, 4]
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(arrayDiff(a, b)).toEqual([1])
  })

  it('takes null and undefined in consideration', () => {
    const a = [1, 2, 3, 4, null, undefined]
    const b = [2, 3, 4, 5]
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(arrayDiff(a, b)).toEqual([1, null, undefined])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('returns empty if A is empty', () => {
    const b = [2, 3, 4, 5]
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(arrayDiff([], b)).toEqual([])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('only takes A in consideration', () => {
    const a = [1, 2, 3]
    const b = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(arrayDiff(a, b)).toEqual([])
  })
})
