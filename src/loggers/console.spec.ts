// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MockDate'.
const MockDate = require('mockdate')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createLogg... Remove this comment to see the full error message
const { createLogger, LEVELS } = require('./index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LoggerCons... Remove this comment to see the full error message
const LoggerConsole = require('./console')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Loggers > Console', () => {
  let logger: any, timeNow: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.spyOn(global.console, 'info').mockImplementation(() => true)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.spyOn(global.console, 'error').mockImplementation(() => true)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.spyOn(global.console, 'warn').mockImplementation(() => true)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.spyOn(global.console, 'log').mockImplementation(() => true)

    timeNow = new Date('2017-12-29T14:15:38.572Z')
    MockDate.set(timeNow.getTime())

    logger = createLogger({ level: LEVELS.DEBUG, logCreator: LoggerConsole })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(() => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'global'.
    global.console.info.mockRestore()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'global'.
    global.console.error.mockRestore()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'global'.
    global.console.warn.mockRestore()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'global'.
    global.console.log.mockRestore()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('logs INFO', () => {
    logger.info('<info message>', { extra1: true })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(console.info).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'INFO',
        timestamp: timeNow.toISOString(),
        logger: 'kafkajs',
        message: '<info message>',
        extra1: true,
      })
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('logs ERROR', () => {
    logger.error('<error message>', { extra1: true })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(console.error).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'ERROR',
        timestamp: timeNow.toISOString(),
        logger: 'kafkajs',
        message: '<error message>',
        extra1: true,
      })
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('logs WARN', () => {
    logger.warn('<warn message>', { extra1: true })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(console.warn).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'WARN',
        timestamp: timeNow.toISOString(),
        logger: 'kafkajs',
        message: '<warn message>',
        extra1: true,
      })
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('logs DEBUG', () => {
    logger.debug('<debug message>', { extra1: true })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'DEBUG',
        timestamp: timeNow.toISOString(),
        logger: 'kafkajs',
        message: '<debug message>',
        extra1: true,
      })
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when the log level is NOTHING', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      logger = createLogger({ level: LEVELS.NOTHING, logCreator: LoggerConsole })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not log', () => {
      logger.info('<do not log info>', { extra1: true })
      logger.error('<do not log error>', { extra1: true })
      logger.warn('<do not log warn>', { extra1: true })
      logger.debug('<do not log debug>', { extra1: true })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(console.info).not.toHaveBeenCalled()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(console.error).not.toHaveBeenCalled()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(console.warn).not.toHaveBeenCalled()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(console.log).not.toHaveBeenCalled()
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when namespace is present', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      const rootLogger = createLogger({ level: LEVELS.DEBUG, logCreator: LoggerConsole })
      logger = rootLogger.namespace('MyNamespace')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('includes the namespace into the message', () => {
      logger.info('<namespace info>', { extra1: true })
      logger.error('<namespace error>', { extra1: true })
      logger.warn('<namespace warn>', { extra1: true })
      logger.debug('<namespace debug>', { extra1: true })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(console.info).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'INFO',
          timestamp: timeNow.toISOString(),
          logger: 'kafkajs',
          message: '[MyNamespace] <namespace info>',
          extra1: true,
        })
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(console.error).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'ERROR',
          timestamp: timeNow.toISOString(),
          logger: 'kafkajs',
          message: '[MyNamespace] <namespace error>',
          extra1: true,
        })
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(console.warn).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'WARN',
          timestamp: timeNow.toISOString(),
          logger: 'kafkajs',
          message: '[MyNamespace] <namespace warn>',
          extra1: true,
        })
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(console.log).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'DEBUG',
          timestamp: timeNow.toISOString(),
          logger: 'kafkajs',
          message: '[MyNamespace] <namespace debug>',
          extra1: true,
        })
      )
    })
  })
})
