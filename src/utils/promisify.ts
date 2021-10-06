/** @format */

/** Promisifies a given function that has a final callback argument. */
export function promisify<
  // deno-lint-ignore no-explicit-any
  T extends (...args: any[]) => any,
  $FirstParams extends unknown[] = Parameters<T> extends [
    ...infer $FirstParams,
    infer _
  ]
    ? $FirstParams
    : // deno-lint-ignore no-explicit-any
      any[]
>(
  fn: T
): (...args: $FirstParams) => // deno-lint-ignore no-explicit-any
Promise<Parameters<T> extends [...infer _, infer $Last] ? $Last : any> {
  return (...args: $FirstParams) => {
    return new Promise((resolve, reject) => {
      try {
        fn(...args, resolve);
      } catch (err) {
        reject(err);
      }
    });
  };
}
