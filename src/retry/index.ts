// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSNum... Remove this comment to see the full error message
import { KafkaJSNumberOfRetriesExceeded } from '../errors'

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
const isTestMode = process.env.NODE_ENV === 'test'
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
//const RETRY_DEFAULT = isTestMode ? import * from  : import * from './defaults'
if (isTestMode){
  import RETRY_DEFAULT from './defaults.test'

} else import RETRY_DEFAULT from './defaults'


const random = (min: any, max: any) => {
  return Math.random() * (max - min) + min
}

const randomFromRetryTime = (factor: any, retryTime: any) => {
  const delta = factor * retryTime
  return Math.ceil(random(retryTime - delta, retryTime + delta))
}

const UNRECOVERABLE_ERRORS = ['RangeError', 'ReferenceError', 'SyntaxError', 'TypeError']
// @ts-expect-error ts-migrate(2550) FIXME: Property 'includes' does not exist on type 'string... Remove this comment to see the full error message
const isErrorUnrecoverable = (e: any) => UNRECOVERABLE_ERRORS.includes(e.name)
const isErrorRetriable = (error: any) => (error.retriable || error.retriable !== false) && !isErrorUnrecoverable(error)

const createRetriable = (configs: any, resolve: any, reject: any, fn: any) => {
  let aborted = false
  const { factor, multiplier, maxRetryTime, retries } = configs

  const bail = (error: any) => {
    aborted = true
    reject(error || new Error('Aborted'))
  }

  const calculateExponentialRetryTime = (retryTime: any) => {
    return Math.min(randomFromRetryTime(factor, retryTime) * multiplier, maxRetryTime)
  }

  const retry = (retryTime: any, retryCount = 0) => {
    if (aborted) return

    const nextRetryTime = calculateExponentialRetryTime(retryTime)
    const shouldRetry = retryCount < retries

    const scheduleRetry = () => {
      setTimeout(() => retry(nextRetryTime, retryCount + 1), retryTime)
    }

    fn(bail, retryCount, retryTime)
      .then(resolve)
      .catch((e: any) => {
        if (shouldRetry && isErrorRetriable(e)) {
          scheduleRetry()
        } else {
          reject(new KafkaJSNumberOfRetriesExceeded(e, { retryCount, retryTime }))
        }
      })
  }

  return retry
}

/**
 * @typedef {(fn: (bail: (err: Error) => void, retryCount: number, retryTime: number) => any) => Promise<ReturnType<fn>>} Retrier
 */

/**
 * @param {import("../../types").RetryOptions} [opts]
 * @returns {Retrier}
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export (opts = {}) => (fn: any) => {
  // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
  return new Promise((resolve: any, reject: any) => {
    // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
    const configs = Object.assign({}, RETRY_DEFAULT, opts)
    const start = createRetriable(configs, resolve, reject, fn)
    start(randomFromRetryTime(configs.factor, configs.initialRetryTime))
  });
}
