// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MockDate'.
const MockDate = require('mockdate')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createLogg... Remove this comment to see the full error message
const { createLogger, LEVELS } = require('./index')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Loggers', () => {
  let logger: any, timeNow: any, MyLogCreator: any, myLogger: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    timeNow = new Date('2017-12-29T14:15:38.572Z')
    MockDate.set(timeNow.getTime())

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    myLogger = jest.fn()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    MyLogCreator = jest.fn((logLevel: any) => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      return jest.fn(({
        namespace,
        level,
        label,
        log
      }: any) => {
        myLogger(logLevel, { namespace, level, label, log })
      });
    })

    const rootLogger = createLogger({ logCreator: MyLogCreator, level: LEVELS.DEBUG })
    logger = rootLogger.namespace('MyNamespace')
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls the log creator with the log level', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(MyLogCreator).toHaveBeenCalledWith(LEVELS.DEBUG)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls log function info with namespace, level, label, and log', () => {
    logger.info('<message info>', { extra1: true })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(myLogger).toHaveBeenCalledWith(LEVELS.DEBUG, {
      namespace: 'MyNamespace',
      level: LEVELS.INFO,
      label: 'INFO',
      log: {
        timestamp: timeNow.toISOString(),
        logger: 'kafkajs',
        message: '<message info>',
        extra1: true,
      },
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls log function error with namespace, level, label, and log', () => {
    logger.error('<message error>', { extra1: true })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(myLogger).toHaveBeenCalledWith(LEVELS.DEBUG, {
      namespace: 'MyNamespace',
      level: LEVELS.ERROR,
      label: 'ERROR',
      log: {
        timestamp: timeNow.toISOString(),
        logger: 'kafkajs',
        message: '<message error>',
        extra1: true,
      },
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls log function warn with namespace, level, label, and log', () => {
    logger.warn('<message warn>', { extra1: true })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(myLogger).toHaveBeenCalledWith(LEVELS.DEBUG, {
      namespace: 'MyNamespace',
      level: LEVELS.WARN,
      label: 'WARN',
      log: {
        timestamp: timeNow.toISOString(),
        logger: 'kafkajs',
        message: '<message warn>',
        extra1: true,
      },
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls log function debug with namespace, level, label, and log', () => {
    logger.debug('<message debug>', { extra1: true })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(myLogger).toHaveBeenCalledWith(LEVELS.DEBUG, {
      namespace: 'MyNamespace',
      level: LEVELS.DEBUG,
      label: 'DEBUG',
      log: {
        timestamp: timeNow.toISOString(),
        logger: 'kafkajs',
        message: '<message debug>',
        extra1: true,
      },
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('accepts a custom logLevel for the namespaced logger', () => {
    const newLogger = logger.namespace('Custom', LEVELS.NOTHING)
    newLogger.debug('<test custom logLevel for namespaced logger>')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(myLogger).not.toHaveBeenCalled()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('allows overriding the logLevel after instantiation', () => {
    logger.setLogLevel(LEVELS.INFO)

    logger.debug('Debug message that never gets logged')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(myLogger).not.toHaveBeenCalled()

    logger.info('Info message', { extra: true })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(myLogger).toHaveBeenCalledWith(LEVELS.DEBUG, {
      namespace: 'MyNamespace',
      level: LEVELS.INFO,
      label: 'INFO',
      log: {
        timestamp: timeNow.toISOString(),
        logger: 'kafkajs',
        message: 'Info message',
        extra: true,
      },
    })
  })
})
