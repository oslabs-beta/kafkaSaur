// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestV0'... Remove this comment to see the full error message
import requestV0 from '../v0/request'

// ApiVersions Request after v1 indicates the client can parse throttle_time_ms

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export default() => ({ ...requestV0(), apiVersion: 2 })
