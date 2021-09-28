/**
 * @template T
 * @return {{lock: Promise<T>, unlock: (v?: T) => void, unlockWithError: (e: Error) => void}}
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = () => {
  let unlock
  let unlockWithError
  // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
  const lock = new Promise((resolve: any) => {
    unlock = resolve
    unlockWithError = resolve
  })

  return { lock, unlock, unlockWithError }
}
