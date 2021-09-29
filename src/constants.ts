// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EARLIEST_O... Remove this comment to see the full error message
const EARLIEST_OFFSET = -2
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LATEST_OFF... Remove this comment to see the full error message
const LATEST_OFFSET = -1
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'INT_32_MAX... Remove this comment to see the full error message
const INT_32_MAX_VALUE = Math.pow(2, 32)

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export {
  EARLIEST_OFFSET,
  LATEST_OFFSET,
  INT_32_MAX_VALUE,
}
