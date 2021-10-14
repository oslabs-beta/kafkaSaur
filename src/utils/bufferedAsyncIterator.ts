const defaultErrorHandler = (e: any): any => {
  throw e
}

/**
 * Generator that processes the given promises, and yields their result in the order of them resolving.
 *
 * @template T
 * @param {Promise<T>[]} promises promises to process
 * @param {(err: Error) => any} [handleError] optional error handler
 * @returns {Generator<Promise<T>>}
 */
function* BufferedAsyncIterator(promises: any, handleError = defaultErrorHandler) {
  /** Queue of promises in order of resolution */
  const promisesQueue: any = []
  /** Queue of {resolve, reject} in the same order as `promisesQueue` */
  const resolveRejectQueue: any = []

  promises.forEach((promise: any) => {
    // Create a new promise into the promises queue, and keep the {resolve,reject}
    // in the resolveRejectQueue
    let resolvePromise
    let rejectPromise
    promisesQueue.push(
      new Promise((resolve: any, reject: any) => {
        resolvePromise = resolve
        rejectPromise = reject
      })
    )
    resolveRejectQueue.push({ resolve: resolvePromise, reject: rejectPromise })

    // When the promise resolves pick the next available {resolve, reject}, and
    // through that resolve the next promise in the queue
    promise.then(
      (result: any) => {
        const { resolve } = resolveRejectQueue.pop()
        resolve(result)
      },
      async (err: any) => {
        const { reject } = resolveRejectQueue.pop()
        try {
          await handleError(err)
          reject(err)
        } catch (newError) {
          reject(newError)
        }
      }
    )
  })

  // While there are promises left pick the next one to yield
  // The caller will then wait for the value to resolve.
  while (promisesQueue.length > 0) {
    const nextPromise = promisesQueue.pop()
    yield nextPromise
  }
}

export default BufferedAsyncIterator
