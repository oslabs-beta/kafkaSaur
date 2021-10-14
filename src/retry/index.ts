//deno-lint-ignore-file no-explicit-any no-unused-vars
/** @format */

import { KafkaJSNumberOfRetriesExceeded } from '../errors.ts';
import process from 'https://deno.land/std@0.110.0/node/process.ts';

const isTestMode = process.env.NODE_ENV === 'test';
//const RETRY_DEFAULT = isTestMode ? import * from  : import * from './defaults'

import RETRY_DEFAULT from './defaults.ts';

const random = (min: any, max: any) => {
  return Math.random() * (max - min) + min;
};

const randomFromRetryTime = (factor: any, retryTime: any) => {
  const delta = factor * retryTime;
  return Math.ceil(random(retryTime - delta, retryTime + delta));
};

const UNRECOVERABLE_ERRORS = [
  'RangeError',
  'ReferenceError',
  'SyntaxError',
  'TypeError',
];
const isErrorUnrecoverable = (e: any) => UNRECOVERABLE_ERRORS.includes(e.name);
const isErrorRetriable = (error: any) =>
  (error.retriable || error.retriable !== false) &&
  !isErrorUnrecoverable(error);

const createRetriable = (configs: any, resolve: any, reject: any, fn: any) => {
  let aborted = false;
  const { factor, multiplier, maxRetryTime, retries } = configs;

  const bail = (error: any) => {
    aborted = true;
    reject(error || new Error('Aborted'));
  };

  const calculateExponentialRetryTime = (retryTime: any) => {
    return Math.min(
      randomFromRetryTime(factor, retryTime) * multiplier,
      maxRetryTime
    );
  };

  const retry = (retryTime: any, retryCount = 0) => {
    if (aborted) return;

    const nextRetryTime = calculateExponentialRetryTime(retryTime);
    const shouldRetry = retryCount < retries;

    const scheduleRetry = () => {
      setTimeout(() => retry(nextRetryTime, retryCount + 1), retryTime);
    };

    fn(bail, retryCount, retryTime)
      .then(resolve)
      .catch((e: any) => {
        if (shouldRetry && isErrorRetriable(e)) {
          scheduleRetry();
        } else {
          reject(
            new KafkaJSNumberOfRetriesExceeded(e, { retryCount, retryTime })
          );
        }
      });
  };

  return retry;
};

/**
 * @typedef {(fn: (bail: (err: Error) => void, retryCount: number, retryTime: number) => any) => Promise<ReturnType<fn>>} Retrier
 */

/**
 * @param {import("../../types").RetryOptions} [opts]
 * @returns {Retrier}
 */
export default (opts = {}) =>
  (fn: any) => {
    return new Promise((resolve: any, reject: any) => {
      const configs = Object.assign({}, RETRY_DEFAULT, opts);
      const start = createRetriable(configs, resolve, reject, fn);
      start(randomFromRetryTime(configs.factor, configs.initialRetryTime));
    });
  };
