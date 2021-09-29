// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'logLevel'.
const { LEVELS: logLevel } = require('./index')

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export () => ({
  namespace,
  level,
  label,
  log
}: any) => {
  const prefix = namespace ? `[${namespace}] ` : ''
  const message = JSON.stringify(
    // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
    Object.assign({ level: label }, log, {
      message: `${prefix}${log.message}`,
    })
  )

  switch (level) {
    case logLevel.INFO:
      return console.info(message)
    case logLevel.ERROR:
      return console.error(message)
    case logLevel.WARN:
      return console.warn(message)
    case logLevel.DEBUG:
      return console.log(message)
  }
}
