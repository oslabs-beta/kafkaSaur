// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { format } = require('util')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSLoc... Remove this comment to see the full error message
const { KafkaJSLockTimeout } = require('../errors')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PRIVATE'.
const PRIVATE = {
  // @ts-expect-error ts-migrate(2585) FIXME: 'Symbol' only refers to a type, but is being used ... Remove this comment to see the full error message
  LOCKED: Symbol('private:Lock:locked'),
  // @ts-expect-error ts-migrate(2585) FIXME: 'Symbol' only refers to a type, but is being used ... Remove this comment to see the full error message
  TIMEOUT: Symbol('private:Lock:timeout'),
  // @ts-expect-error ts-migrate(2585) FIXME: 'Symbol' only refers to a type, but is being used ... Remove this comment to see the full error message
  WAITING: Symbol('private:Lock:waiting'),
  // @ts-expect-error ts-migrate(2585) FIXME: 'Symbol' only refers to a type, but is being used ... Remove this comment to see the full error message
  TIMEOUT_ERROR_MESSAGE: Symbol('private:Lock:timeoutErrorMessage'),
}

const TIMEOUT_MESSAGE = 'Timeout while acquiring lock (%d waiting locks)'

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class Lock {
  constructor({
    timeout,
    description = null
  }: any = {}) {
    if (typeof timeout !== 'number') {
      throw new TypeError(`'timeout' is not a number, received '${typeof timeout}'`)
    }

    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    this[(PRIVATE as any).LOCKED] = false;
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    this[(PRIVATE as any).TIMEOUT] = timeout;
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    this[(PRIVATE as any).WAITING] = new Set();
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    this[(PRIVATE as any).TIMEOUT_ERROR_MESSAGE] = () => {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const timeoutMessage = format(TIMEOUT_MESSAGE, this[PRIVATE.WAITING].size);
    return description ? `${timeoutMessage}: "${description}"` : timeoutMessage;
};
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      const timeoutMessage = format(TIMEOUT_MESSAGE, this[(PRIVATE as any).WAITING].size);
      return description ? `${timeoutMessage}: "${description}"` : timeoutMessage
    }
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'async'.
  async acquire() {
    return new Promise((resolve: any, reject: any) => {
      if (!this[(PRIVATE as any).LOCKED]) {
        this[(PRIVATE as any).LOCKED] = true;
        return resolve()
      }

      let timeoutId: any = null
      const tryToAcquire = async () => {
        if (!this[(PRIVATE as any).LOCKED]) {
          this[(PRIVATE as any).LOCKED] = true;
          clearTimeout(timeoutId)
          this[(PRIVATE as any).WAITING].delete(tryToAcquire);
          return resolve()
        }
      }

      this[(PRIVATE as any).WAITING].add(tryToAcquire);
      timeoutId = setTimeout(() => {
    // The message should contain the number of waiters _including_ this one
    const error = new KafkaJSLockTimeout(this[PRIVATE.TIMEOUT_ERROR_MESSAGE]());
    this[PRIVATE.WAITING].delete(tryToAcquire);
    reject(error);
}, this[(PRIVATE as any).TIMEOUT]);
        // The message should contain the number of waiters _including_ this one
const error = new KafkaJSLockTimeout(this[(PRIVATE as any).TIMEOUT_ERROR_MESSAGE]());
        this[(PRIVATE as any).WAITING].delete(tryToAcquire);
        reject(error)
      }, this[PRIVATE.TIMEOUT])
    });
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'async'.
  async release() {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    this[(PRIVATE as any).LOCKED] = false;
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const waitingLock = this[(PRIVATE as any).WAITING].values().next().value;

    if (waitingLock) {
      return waitingLock()
    }
  }
}
