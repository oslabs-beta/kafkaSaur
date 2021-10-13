/** @format */

import swapObject from '../utils/swapObject.ts';
import networkEvents from '../network/instrumentationEvents.ts';
import InstrumentationEventType from '../instrumentation/eventType.ts';
const producerType = InstrumentationEventType('producer');

const events = {
  CONNECT: producerType('connect'),
  DISCONNECT: producerType('disconnect'),
  REQUEST: producerType(networkEvents.NETWORK_REQUEST),
  REQUEST_TIMEOUT: producerType(networkEvents.NETWORK_REQUEST_TIMEOUT),
  REQUEST_QUEUE_SIZE: producerType(networkEvents.NETWORK_REQUEST_QUEUE_SIZE),
};

const wrappedEvents: any = {
  [events.REQUEST]: networkEvents.NETWORK_REQUEST,
  [events.REQUEST_TIMEOUT]: networkEvents.NETWORK_REQUEST_TIMEOUT,
  [events.REQUEST_QUEUE_SIZE]: networkEvents.NETWORK_REQUEST_QUEUE_SIZE,
};

const reversedWrappedEvents: any = swapObject(wrappedEvents);
const unwrap = (eventName: any) => wrappedEvents[eventName] || eventName;
const wrap = (eventName: any) => reversedWrappedEvents[eventName] || eventName;

export { events, wrap, unwrap };
