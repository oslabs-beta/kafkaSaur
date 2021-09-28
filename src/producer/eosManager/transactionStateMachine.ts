// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EventEmitt... Remove this comment to see the full error message
const { EventEmitter } = require('events')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSNon... Remove this comment to see the full error message
const { KafkaJSNonRetriableError } = require('../../errors')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'STATES'.
const STATES = require('./transactionStates')

const VALID_STATE_TRANSITIONS = {
  [STATES.UNINITIALIZED]: [STATES.READY],
  [STATES.READY]: [STATES.READY, STATES.TRANSACTING],
  [STATES.TRANSACTING]: [STATES.COMMITTING, STATES.ABORTING],
  [STATES.COMMITTING]: [STATES.READY],
  [STATES.ABORTING]: [STATES.READY],
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
  logger,
  initialState = STATES.UNINITIALIZED
}: any) => {
  let currentState = initialState

  const guard = (object: any, method: any, {
    legalStates,
    async: isAsync = true
  }: any) => {
    if (!object[method]) {
      throw new KafkaJSNonRetriableError(`Cannot add guard on missing method "${method}"`)
    }

    return (...args: any[]) => {
      const fn = object[method]

      if (!legalStates.includes(currentState)) {
        const error = new KafkaJSNonRetriableError(
          `Transaction state exception: Cannot call "${method}" in state "${currentState}"`
        )

        if (isAsync) {
          // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
          return Promise.reject(error)
        } else {
          throw error
        }
      }

      return fn.apply(object, args)
    };
  }

  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
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
      const guardedMethods = Object.keys(methodStateMapping).reduce((guards, method) => {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        guards[method] = guard(object, method, methodStateMapping[method])
        return guards
      }, {})

      return { ...object, ...guardedMethods }
    },
    /**
     * Transition safely to a new state
     */
    transitionTo(state: any) {
      logger.debug(`Transaction state transition ${currentState} --> ${state}`)

      // @ts-expect-error ts-migrate(2550) FIXME: Property 'includes' does not exist on type 'any[]'... Remove this comment to see the full error message
      if (!VALID_STATE_TRANSITIONS[currentState].includes(state)) {
        throw new KafkaJSNonRetriableError(
          `Transaction state exception: Invalid transition ${currentState} --> ${state}`
        )
      }

      stateMachine.emit('transition', { to: state, from: currentState })
      currentState = state
    },

    state() {
      return currentState
    },
  })

  return stateMachine
}
