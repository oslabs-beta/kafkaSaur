/**
 * @template T
 * @param { (...args: any) => Promise<T> } [asyncFunction]
 * Promise returning function that will only ever be invoked sequentially.
 * @returns { (...args: any) => Promise<T> }
 * Function that may invoke asyncFunction if there is not a currently executing invocation.
 * Returns promise from the currently executing invocation.
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export (asyncFunction: any) => {
  let promise: any = null

  return (...args: any[]) => {
    if (promise == null) {
      promise = asyncFunction(...args).finally(() => (promise = null))
    }
    return promise
  };
}
