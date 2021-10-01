/** @format */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'swapObject... Remove this comment to see the full error message
const swapObject = require('../utils/swapObject');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'networkEve... Remove this comment to see the full error message
const networkEvents = require('../network/instrumentationEvents');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Instrument... Remove this comment to see the full error message
const InstrumentationEventType = require('../instrumentation/eventType');
const producerType = InstrumentationEventType('producer');

const events = {
  CONNECT: producerType('connect'),
  DISCONNECT: producerType('disconnect'),
  REQUEST: producerType(networkEvents.NETWORK_REQUEST),
  REQUEST_TIMEOUT: producerType(networkEvents.NETWORK_REQUEST_TIMEOUT),
  REQUEST_QUEUE_SIZE: producerType(networkEvents.NETWORK_REQUEST_QUEUE_SIZE),
};

const wrappedEvents = {
  [events.REQUEST]: networkEvents.NETWORK_REQUEST,
  [events.REQUEST_TIMEOUT]: networkEvents.NETWORK_REQUEST_TIMEOUT,
  [events.REQUEST_QUEUE_SIZE]: networkEvents.NETWORK_REQUEST_QUEUE_SIZE,
};

const reversedWrappedEvents = swapObject(wrappedEvents);
const unwrap = (eventName: any) => wrappedEvents[eventName] || eventName;
const wrap = (eventName: any) => reversedWrappedEvents[eventName] || eventName;

export { events, wrap, unwrap };
