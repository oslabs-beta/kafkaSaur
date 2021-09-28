// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sleep'.
const sleep = require('./sleep')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSTim... Remove this comment to see the full error message
const { KafkaJSTimeout } = require('../errors')

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = (
  fn: any,
  { delay = 50, maxWait = 10000, timeoutMessage = 'Timeout', ignoreTimeout = false } = {}
) => {
  let timeoutId: any
  let totalWait = 0
  let fulfilled = false

  const checkCondition = async (resolve: any, reject: any) => {
    totalWait += delay
    await sleep(delay)

    try {
      const result = await fn(totalWait)
      if (result) {
        fulfilled = true
        clearTimeout(timeoutId)
        return resolve(result)
      }

      checkCondition(resolve, reject)
    } catch (e) {
      fulfilled = true
      clearTimeout(timeoutId)
      reject(e)
    }
  }

  // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
  return new Promise((resolve: any, reject: any) => {
    checkCondition(resolve, reject)

    if (ignoreTimeout) {
      return
    }

    timeoutId = setTimeout(() => {
      if (!fulfilled) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
        return reject(new KafkaJSTimeout(timeoutMessage))
      }
    }, maxWait)
  });
}
