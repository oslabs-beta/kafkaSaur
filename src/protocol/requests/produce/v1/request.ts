// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestV0'... Remove this comment to see the full error message
const requestV0 = require('../v0/request')

// Produce Request on or after v1 indicates the client can parse the quota throttle time
// in the Produce Response.

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  acks,
  timeout,
  topicData
}: any) => {
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  return Object.assign(requestV0({ acks, timeout, topicData }), { apiVersion: 1 })
}
