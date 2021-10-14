/** @format */

// deno-lint-ignore-file
/** @format */
import process from 'https://deno.land/std@0.110.0/node/process.ts';

const { assign } = Object;

type LEVELS = {
  NOTHING: number;
  ERROR: number;
  WARN: number;
  INFO: number;
  DEBUG: number;
  DEMO: number
};

const LEVELS = {
  NOTHING: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 4,
  DEMO: 5,
  DEBUG: 6
};

const createLevel =
  (
    label: any,
    level: any,
    currentLevel: any,
    namespace: any,
    logFunction: any
  ) =>
  (message: any, extra = {}) => {
    if (level > currentLevel()) return;
    logFunction({
      namespace,
      level,
      label,
      log: assign(
        {
          timestamp: new Date().toISOString(),
          message,
        },
        extra
      ),
    });
  };

const evaluateLogLevel = (logLevel: any) => {
  const envLogLevel = (process.env.KAFKAJS_LOG_LEVEL || '').toUpperCase();
  return LEVELS[envLogLevel as keyof LEVELS] == null
    ? logLevel
    : LEVELS[envLogLevel as keyof LEVELS];
};

const createLogger = ({ level = LEVELS.INFO, logCreator }: any = {}) => {
  let logLevel = evaluateLogLevel(level);
  const logFunction = logCreator(logLevel);

  const createNamespace = (namespace: any, logLevel = null) => {
    const namespaceLogLevel = evaluateLogLevel(logLevel);
    return createLogFunctions(namespace, namespaceLogLevel);
  };

  const createLogFunctions = (namespace?: any, namespaceLogLevel = null) => {
    const currentLogLevel = () =>
      namespaceLogLevel == null ? logLevel : namespaceLogLevel;
    const logger = {
      info: createLevel(
        'INFO',
        LEVELS.INFO,
        currentLogLevel,
        namespace,
        logFunction
      ),
      error: createLevel(
        'ERROR',
        LEVELS.ERROR,
        currentLogLevel,
        namespace,
        logFunction
      ),
      warn: createLevel(
        'WARN',
        LEVELS.WARN,
        currentLogLevel,
        namespace,
        logFunction
      ),
      debug: createLevel(
        'DEBUG',
        LEVELS.DEBUG,
        currentLogLevel,
        namespace,
        logFunction
      ),
      demo: createLevel(
        'DEMO',
        LEVELS.DEMO,
        currentLogLevel,
        namespace,
        logFunction
      ),
    };

    return assign(logger, {
      namespace: createNamespace,
      setLogLevel: (newLevel: any) => {
        logLevel = newLevel;
      },
    });
  };

  return createLogFunctions();
};

export { LEVELS, createLogger };
