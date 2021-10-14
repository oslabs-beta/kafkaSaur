/** @format */

import { format } from 'https://deno.land/std@0.110.0/node/util.ts';
import { KafkaJSLockTimeout } from '../errors.ts';

const PRIVATE = {
  LOCKED: Symbol('private:Lock:locked') as unknown as string, 
  TIMEOUT: Symbol('private:Lock:timeout') as unknown as string,
  WAITING: Symbol('private:Lock:waiting') as unknown as string,
  TIMEOUT_ERROR_MESSAGE: Symbol('private:Lock:timeoutErrorMessage') as unknown as string,
};


const TIMEOUT_MESSAGE = 'Timeout while acquiring lock (%d waiting locks)';

export default class Lock {
  [key: string]: any;

  constructor({ timeout, description = null }: any = {}) {
    if (typeof timeout !== 'number') {
      throw new TypeError(
        `'timeout' is not a number, received '${typeof timeout}'`
      );
    }

    this[PRIVATE.LOCKED]  = false;
    this[PRIVATE.TIMEOUT] = timeout;
    this[PRIVATE.WAITING] = new Set();
    this[PRIVATE.TIMEOUT_ERROR_MESSAGE] = () => {
      const timeoutMessage = format(
        TIMEOUT_MESSAGE,
        this[PRIVATE.WAITING].size
      );
      return description
        ? `${timeoutMessage}: "${description}"`
        : timeoutMessage;
    };
  }
  // deno-lint-ignore require-await 
    async acquire() {
    return  new Promise((resolve: any, reject: any) => {
      if (!this[PRIVATE.LOCKED]) {
        this[PRIVATE.LOCKED] = true;
        return resolve();
      }

      let timeoutId: any = null;
      // deno-lint-ignore require-await 
      const tryToAcquire = async () => {
        if (!this[PRIVATE.LOCKED]) {
          this[PRIVATE.LOCKED] = true;
          clearTimeout(timeoutId);
          this[PRIVATE.WAITING].delete(tryToAcquire);
          return resolve();
        }
      };

      this[PRIVATE.WAITING].add(tryToAcquire);
      timeoutId = setTimeout(() => {
        // The message should contain the number of waiters _including_ this one
        const error = new KafkaJSLockTimeout(
          this[PRIVATE.TIMEOUT_ERROR_MESSAGE]()
        );
        this[PRIVATE.WAITING].delete(tryToAcquire);
        reject(error);
      }, this[PRIVATE.TIMEOUT]);
    });
  }
// deno-lint-ignore require-await 
  async release() {
    this[PRIVATE.LOCKED] = false;
    const waitingLock = this[PRIVATE.WAITING].values().next().value;

    if (waitingLock) {
      return waitingLock();
    }
  }
}
