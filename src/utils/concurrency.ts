// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSNon... Remove this comment to see the full error message
const { KafkaJSNonRetriableError } = require('../errors')

const REJECTED_ERROR = new KafkaJSNonRetriableError(
  'Queued function aborted due to earlier promise rejection'
)
function NOOP() {}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'concurrenc... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
  return (action: any) => new Promise((resolve: any, reject: any) => push(action, resolve, reject));
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = concurrency
