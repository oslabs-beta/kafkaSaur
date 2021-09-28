// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'swapObject... Remove this comment to see the full error message
const swapObject = require('./swapObject')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Utils > swapObject', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('swaps keys with values', () => {
    const obj = {
      a1: 'a2',
      b1: 'b2',
      c1: 'c2',
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(swapObject(obj)).toEqual({
      a2: 'a1',
      b2: 'b1',
      c2: 'c1',
    })
  })
})
