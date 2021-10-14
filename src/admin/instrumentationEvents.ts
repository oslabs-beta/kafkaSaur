import swapObject from '../utils/swapObject.ts'
import networkEvents from '../network/instrumentationEvents.ts'
import InstrumentationEventType from '../instrumentation/eventType.ts'

const adminType = InstrumentationEventType('admin')

const events = {
  CONNECT: adminType('connect'),
  DISCONNECT: adminType('disconnect'),
  REQUEST: adminType(networkEvents.NETWORK_REQUEST),
  REQUEST_TIMEOUT: adminType(networkEvents.NETWORK_REQUEST_TIMEOUT),
  REQUEST_QUEUE_SIZE: adminType(networkEvents.NETWORK_REQUEST_QUEUE_SIZE),
}

const wrappedEvents = {
  [events.REQUEST]: networkEvents.NETWORK_REQUEST,
  [events.REQUEST_TIMEOUT]: networkEvents.NETWORK_REQUEST_TIMEOUT,
  [events.REQUEST_QUEUE_SIZE]: networkEvents.NETWORK_REQUEST_QUEUE_SIZE,
}

const reversedWrappedEvents: any = swapObject(wrappedEvents)
const unwrap = (eventName: any) => wrappedEvents[eventName] || eventName
const wrap = (eventName: any) => reversedWrappedEvents[eventName] || eventName

export {
  events,
  wrap,
  unwrap,
}
