// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'swapObject... Remove this comment to see the full error message
const swapObject = require('../utils/swapObject')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Instrument... Remove this comment to see the full error message
const InstrumentationEventType = require('../instrumentation/eventType')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'networkEve... Remove this comment to see the full error message
const networkEvents = require('../network/instrumentationEvents')
const consumerType = InstrumentationEventType('consumer')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'events'.
const events = {
  HEARTBEAT: consumerType('heartbeat'),
  COMMIT_OFFSETS: consumerType('commit_offsets'),
  GROUP_JOIN: consumerType('group_join'),
  FETCH: consumerType('fetch'),
  FETCH_START: consumerType('fetch_start'),
  START_BATCH_PROCESS: consumerType('start_batch_process'),
  END_BATCH_PROCESS: consumerType('end_batch_process'),
  CONNECT: consumerType('connect'),
  DISCONNECT: consumerType('disconnect'),
  STOP: consumerType('stop'),
  CRASH: consumerType('crash'),
  REBALANCING: consumerType('rebalancing'),
  RECEIVED_UNSUBSCRIBED_TOPICS: consumerType('received_unsubscribed_topics'),
  REQUEST: consumerType(networkEvents.NETWORK_REQUEST),
  REQUEST_TIMEOUT: consumerType(networkEvents.NETWORK_REQUEST_TIMEOUT),
  REQUEST_QUEUE_SIZE: consumerType(networkEvents.NETWORK_REQUEST_QUEUE_SIZE),
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
export {
  events,
  wrap,
  unwrap,
}
