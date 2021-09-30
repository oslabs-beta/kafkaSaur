import InstrumentationEventType from '../instrumentation/eventType.ts'

const eventType = InstrumentationEventType('network')

export default {
  NETWORK_REQUEST: eventType('request'),
  NETWORK_REQUEST_TIMEOUT: eventType('request_timeout'),
  NETWORK_REQUEST_QUEUE_SIZE: eventType('request_queue_size'),
}
