// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'groupBy'.
import groupBy from './groupBy'

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Utils > groupBy', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('group items by the function return', async () => {
    const input = [1, 2, 3, 4]
    const groupFn = (item: any) => item % 2 === 0 ? 'even' : 'odd'
    // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Map'. Do you need to change your... Remove this comment to see the full error message
    const output = new Map([
      ['even', [2, 4]],
      ['odd', [1, 3]],
    ])

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(groupBy(input, groupFn)).resolves.toEqual(output)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('works with async functions', async () => {
    const input = [1, 2, 3, 4]
    const groupFn = async (item: any) => item % 2 === 0 ? 'even' : 'odd'
    // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Map'. Do you need to change your... Remove this comment to see the full error message
    const output = new Map([
      ['even', [2, 4]],
      ['odd', [1, 3]],
    ])

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(groupBy(input, groupFn)).resolves.toEqual(output)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('works with objects as group keys', async () => {
    const even = {}
    const odd = {}

    const input = [1, 2, 3, 4]
    const groupFn = async (item: any) => item % 2 === 0 ? even : odd
    // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Map'. Do you need to change your... Remove this comment to see the full error message
    const output = new Map([
      [even, [2, 4]],
      [odd, [1, 3]],
    ])

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(groupBy(input, groupFn)).resolves.toEqual(output)
  })
})
