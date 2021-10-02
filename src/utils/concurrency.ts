import { KafkaJSNonRetriableError } from '../errors.ts'

const REJECTED_ERROR = new KafkaJSNonRetriableError(
  'Queued function aborted due to earlier promise rejection'
)
function NOOP() {}

const concurrency = ({
  limit,
  onChange = NOOP
}: any = {}) => {
  if (isNaN(limit) || typeof limit !== 'number' || limit < 1) {
    throw new KafkaJSNonRetriableError(`"limit" cannot be less than 1`)
  }

  let waiting: any = []
  let semaphore = 0

  const clear = () => {
    for (const lazyAction of waiting) {
      lazyAction((_1: any, _2: any, reject: any) => reject(REJECTED_ERROR))
    }
    waiting = []
    semaphore = 0
  }

  const next = () => {
    semaphore--
    onChange(semaphore)

    if (waiting.length > 0) {
      const lazyAction = waiting.shift()
      lazyAction()
    }
  }

  const invoke = (action: any, resolve: any, reject: any) => {
    semaphore++
    onChange(semaphore)

    action()
      .then((result: any) => {
        resolve(result)
        next()
      })
      .catch((error: any) => {
        reject(error)
        clear()
      })
  }

  const push = (action: any, resolve: any, reject: any) => {
    if (semaphore < limit) {
      invoke(action, resolve, reject)
    } else {
      waiting.push((override: any) => {
        const execute = override || invoke
        execute(action, resolve, reject)
      })
    }
  }

  return (action: any) => new Promise((resolve: any, reject: any) => push(action, resolve, reject));
}

export default concurrency
