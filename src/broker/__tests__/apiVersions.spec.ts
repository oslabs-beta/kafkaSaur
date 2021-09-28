// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createConn... Remove this comment to see the full error message
const { createConnection, connectionOpts, newLogger } = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSPro... Remove this comment to see the full error message
const { KafkaJSProtocolError, KafkaJSNonRetriableError } = require('../../errors')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createErro... Remove this comment to see the full error message
const { createErrorFromCode } = require('../../protocol/error')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requests'.
const { requests } = require('../../protocol/requests')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Broker'.
const Broker = require('../index')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UNSUPPORTE... Remove this comment to see the full error message
const UNSUPPORTED_VERSION_CODE = 35

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Broker > ApiVersions', () => {
  let broker: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    broker = new Broker({
      connection: createConnection(connectionOpts()),
      logger: newLogger(),
    })
    await broker.connect()
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    broker && (await broker.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(broker.apiVersions()).resolves.toBeTruthy()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('try to use the latest version', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.spyOn(requests.ApiVersions, 'protocol').mockImplementationOnce(() => () => {
      throw new KafkaJSProtocolError(createErrorFromCode(UNSUPPORTED_VERSION_CODE))
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(broker.apiVersions()).resolves.toBeTruthy()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(requests.ApiVersions.protocol).toHaveBeenCalledWith({ version: 2 })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(requests.ApiVersions.protocol).toHaveBeenCalledWith({ version: 1 })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(requests.ApiVersions.protocol).not.toHaveBeenCalledWith({ version: 0 })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('throws if API versions cannot be used', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.spyOn(requests.ApiVersions, 'protocol').mockImplementation(() => () => {
      throw new KafkaJSProtocolError(createErrorFromCode(UNSUPPORTED_VERSION_CODE))
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(broker.apiVersions()).rejects.toThrow(
      KafkaJSNonRetriableError,
      'API Versions not supported'
    )
  })
})
