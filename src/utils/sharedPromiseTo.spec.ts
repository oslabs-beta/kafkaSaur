// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sharedProm... Remove this comment to see the full error message
import sharedPromiseTo from './sharedPromiseTo'

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Utils > sharedPromiseTo', () => {
  let resolvePromise1: any, rejectPromise1: any, sharedPromise1: any, asyncFunction: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    asyncFunction = jest.fn(
      () =>
        // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
        new Promise((resolve: any, reject: any) => {
          resolvePromise1 = resolve
          rejectPromise1 = reject
        })
    )
    sharedPromise1 = sharedPromiseTo(asyncFunction)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Returns the same pending promise for every invocation', async () => {
    const p1 = sharedPromise1()
    const p2 = sharedPromise1()
    const p3 = sharedPromise1()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(Object.is(p1, p2)).toBe(true)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(Object.is(p2, p3)).toBe(true)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(asyncFunction).toHaveBeenCalledTimes(1)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('After resolving, returns a new promise on next invocation', async () => {
    const message = 'Resolved promise #1'
    const p1 = sharedPromise1()
    resolvePromise1(message)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(p1).resolves.toBe(message)
    const p2 = sharedPromise1()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(Object.is(p1, p2)).toBe(false)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(asyncFunction).toHaveBeenCalledTimes(2)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('After rejecting, returns a new promise on next invocation', async () => {
    const message = 'Rejected promise #1'
    const p1 = sharedPromise1()
    rejectPromise1(new Error(message))

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(p1).rejects.toThrow(message)
    const p2 = sharedPromise1()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(Object.is(p1, p2)).toBe(false)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(asyncFunction).toHaveBeenCalledTimes(2)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Passes through arguments passed at invocation time', async () => {
    const args = ['arg1', 'arg2']
    const p1 = sharedPromise1(...args)
    resolvePromise1()
    await p1
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(asyncFunction).toHaveBeenCalledWith(...args)
  })
})
