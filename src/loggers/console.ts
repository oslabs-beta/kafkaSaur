/** @format */

//const { LEVELS: logLevel } = require('./index')
import * as lvl from './index.ts';
const { LEVELS: logLevel } = lvl;

export default () =>
  ({ namespace, level, label, log }: any) => {
    const prefix = namespace ? `[${namespace}] ` : '';
    const message = JSON.stringify(
      Object.assign({ level: label }, log, {
        message: `${prefix}${log.message}`,
      })
    );

    switch (level) {
      case logLevel.INFO:
        return console.info(message);
      case logLevel.ERROR:
        return console.error(message);
      case logLevel.WARN:
        return console.warn(message);
      case logLevel.DEBUG:
        return console.log(message);
      case logLevel.DEMO:
        return console.info(message)
    }
  };
