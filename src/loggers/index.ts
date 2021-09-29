// @ts-expect-error ts-migrate(2339) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
const { assign } = Object

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LEVELS'.
const LEVELS = {
  NOTHING: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 4,
  DEBUG: 5,
}

const createLevel = (label: any, level: any, currentLevel: any, namespace: any, logFunction: any) => (
  message: any,
  extra = {}
) => {
  if (level > currentLevel()) return
  logFunction({
    namespace,
    level,
    label,
    log: assign(
      {
        timestamp: new Date().toISOString(),
        logger: 'kafkajs',
        message,
      },
      extra
    ),
  })
}

const evaluateLogLevel = (logLevel: any) => {
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  const envLogLevel = (process.env.KAFKAJS_LOG_LEVEL || '').toUpperCase()
  return LEVELS[envLogLevel] == null ? logLevel : LEVELS[envLogLevel]
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createLogg... Remove this comment to see the full error message
const createLogger = ({
  level = LEVELS.INFO,
  logCreator
}: any = {}) => {
  let logLevel = evaluateLogLevel(level)
  const logFunction = logCreator(logLevel)

  const createNamespace = (namespace: any, logLevel = null) => {
    const namespaceLogLevel = evaluateLogLevel(logLevel)
    return createLogFunctions(namespace, namespaceLogLevel)
  }

  const createLogFunctions = (namespace: any, namespaceLogLevel = null) => {
    const currentLogLevel = () => (namespaceLogLevel == null ? logLevel : namespaceLogLevel)
    const logger = {
      info: createLevel('INFO', LEVELS.INFO, currentLogLevel, namespace, logFunction),
      error: createLevel('ERROR', LEVELS.ERROR, currentLogLevel, namespace, logFunction),
      warn: createLevel('WARN', LEVELS.WARN, currentLogLevel, namespace, logFunction),
      debug: createLevel('DEBUG', LEVELS.DEBUG, currentLogLevel, namespace, logFunction),
    }

    return assign(logger, {
      namespace: createNamespace,
      setLogLevel: (newLevel: any) => {
        logLevel = newLevel
      },
    });
  }

  // @ts-expect-error ts-migrate(2554) FIXME: Expected 1-2 arguments, but got 0.
  return createLogFunctions()
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export {
  LEVELS,
  createLogger,
}
