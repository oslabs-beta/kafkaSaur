//import { EventEmitter } from 'events';
//Deno Library import...

import InstrumentationEvent from './event.ts';
import { KafkaJSError } from '../errors.ts';

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class InstrumentationEventEmitter {
  emitter: any;
  constructor() {
    this.emitter = new EventEmitter()
  }

  /**
   * @param {string} eventName
   * @param {Object} payload
   */
  emit(eventName: any, payload: any) {
    if (!eventName) {
      throw new KafkaJSError('Invalid event name', { retriable: false })
    }

    if (this.emitter.listenerCount(eventName) > 0) {
      const event = new InstrumentationEvent(eventName, payload)
      this.emitter.emit(eventName, event)
    }
  }

  /**
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   * @returns {import("../../types").RemoveInstrumentationEventListener<string>} removeListener
   */
  addListener(eventName: any, listener: any) {
    this.emitter.addListener(eventName, listener)
    return () => this.emitter.removeListener(eventName, listener)
  }
}