import { LEVELS as logLevel } from './index.ts'

export default () => ({
  namespace,
  level,
  label,
  log
}: any) => {
  const prefix = namespace ? `[${namespace}] ` : ''
  const message = JSON.stringify(
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
