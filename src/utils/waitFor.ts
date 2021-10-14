import sleep from './sleep.ts'

import {KafkaJSTimeout}  from '../errors.ts'

export default (
  fn: any,
  { delay = 50, maxWait = 10000, timeoutMessage = 'Timeout', ignoreTimeout = false } : any = {}
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

  
  return new Promise((resolve: any, reject: any) => {
    checkCondition(resolve, reject)

    if (ignoreTimeout) {
      return
    }

    timeoutId = setTimeout(() => {
      if (!fulfilled) {
       
        return reject(new KafkaJSTimeout(timeoutMessage))
      }
    }, maxWait)
  });
}
