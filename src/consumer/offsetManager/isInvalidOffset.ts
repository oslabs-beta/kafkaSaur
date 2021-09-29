// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Long'.
import Long from '../../utils/long.ts'

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export (offset: any) => (!offset && offset !== 0) || Long.fromValue(offset).isNegative()
