// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Instrument... Remove this comment to see the full error message
const InstrumentationEventType = require('../instrumentation/eventType')
const eventType = InstrumentationEventType('network')

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  NETWORK_REQUEST: eventType('request'),
  NETWORK_REQUEST_TIMEOUT: eventType('request_timeout'),
  NETWORK_REQUEST_QUEUE_SIZE: eventType('request_queue_size'),
}
