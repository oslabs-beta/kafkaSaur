/**
 * @template T
 * @return {{lock: Promise<T>, unlock: (v?: T) => void, unlockWithError: (e: Error) => void}}
 */

export default () => {

  let unlock
  let unlockWithError
  const lock = new Promise((resolve: any) => {
    unlock = resolve
    unlockWithError = resolve
  })

  return { lock, unlock, unlockWithError }
}
