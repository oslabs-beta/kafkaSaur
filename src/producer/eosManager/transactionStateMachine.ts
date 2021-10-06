/** @format */

import { EventEmitter } from 'https://deno.land/std@0.110.0/node/events.ts';

import { KafkaJSNonRetriableError } from '../../errors.ts';
import STATES from './transactionStates.ts';

const VALID_STATE_TRANSITIONS = {
  [STATES.UNINITIALIZED]: [STATES.READY],
  [STATES.READY]: [STATES.READY, STATES.TRANSACTING],
  [STATES.TRANSACTING]: [STATES.COMMITTING, STATES.ABORTING],
  [STATES.COMMITTING]: [STATES.READY],
  [STATES.ABORTING]: [STATES.READY],
};

export default ({ logger, initialState = STATES.UNINITIALIZED }: any) => {
  let currentState = initialState;

  const guard = (
    object: any,
    method: string,
    { legalStates, async: isAsync = true }: any
  ) => {
    if (!object[method]) {
      throw new KafkaJSNonRetriableError(
        `Cannot add guard on missing method "${method}"`
      );
    }

    return (...args: any[]) => {
      const fn = object[method];

      if (!legalStates.includes(currentState)) {
        const error = new KafkaJSNonRetriableError(
          `Transaction state exception: Cannot call "${method}" in state "${currentState}"`
        );

        if (isAsync) {
          return Promise.reject(error);
        } else {
          throw error;
        }
      }

      return fn.apply(object, args);
    };
  };

  const stateMachine = Object.assign(new EventEmitter(), {
    /**
     * Create a clone of "object" where we ensure state machine is in correct state
     * prior to calling any of the configured methods
     * @param {Object} object The object whose methods we will guard
     * @param {Object} methodStateMapping Keys are method names on "object"
     * @param {string[]} methodStateMapping.legalStates Legal states for this method
     * @param {boolean=true} methodStateMapping.async Whether this method is async (throw vs reject)
     */
    createGuarded(object: any, methodStateMapping: any) {
      const guardedMethods = Object.keys(methodStateMapping).reduce(
        (guards: Record<any, any>, method) => {
          guards[method] = guard(object, method, methodStateMapping[method]);
          return guards;
        },
        {}
      );

      return { ...object, ...guardedMethods };
    },
    /**
     * Transition safely to a new state
     */
    transitionTo(state: any) {
      logger.debug(`Transaction state transition ${currentState} --> ${state}`);

      if (!VALID_STATE_TRANSITIONS[currentState].includes(state)) {
        throw new KafkaJSNonRetriableError(
          `Transaction state exception: Invalid transition ${currentState} --> ${state}`
        );
      }

      stateMachine.emit('transition', { to: state, from: currentState });
      currentState = state;
    },

    state() {
      return currentState;
    },
  });

  return stateMachine;
};
