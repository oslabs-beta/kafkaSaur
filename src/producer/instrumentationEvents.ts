// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'swapObject... Remove this comment to see the full error message
const swapObject = require('../utils/swapObject')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'networkEve... Remove this comment to see the full error message
const networkEvents = require('../network/instrumentationEvents')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Instrument... Remove this comment to see the full error message
const InstrumentationEventType = require('../instrumentation/eventType')
const producerType = InstrumentationEventType('producer')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'events'.
const events = {
  CONNECT: producerType('connect'),
  DISCONNECT: producerType('disconnect'),
  REQUEST: producerType(networkEvents.NETWORK_REQUEST),
  REQUEST_TIMEOUT: producerType(networkEvents.NETWORK_REQUEST_TIMEOUT),
  REQUEST_QUEUE_SIZE: producerType(networkEvents.NETWORK_REQUEST_QUEUE_SIZE),
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'wrappedEve... Remove this comment to see the full error message
const wrappedEvents = {
  [events.REQUEST]: networkEvents.NETWORK_REQUEST,
  [events.REQUEST_TIMEOUT]: networkEvents.NETWORK_REQUEST_TIMEOUT,
  [events.REQUEST_QUEUE_SIZE]: networkEvents.NETWORK_REQUEST_QUEUE_SIZE,
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'reversedWr... Remove this comment to see the full error message
const reversedWrappedEvents = swapObject(wrappedEvents)
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'unwrap'.
const unwrap = (eventName: any) => wrappedEvents[eventName] || eventName
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'wrap'.
const wrap = (eventName: any) => reversedWrappedEvents[eventName] || eventName

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  events,
  wrap,
  unwrap,
}
