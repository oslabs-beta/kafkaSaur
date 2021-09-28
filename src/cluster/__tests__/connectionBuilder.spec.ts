// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
const { newLogger } = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'connection... Remove this comment to see the full error message
const connectionBuilder = require('../connectionBuilder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Connection... Remove this comment to see the full error message
const Connection = require('../../network/connection')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSCon... Remove this comment to see the full error message
const { KafkaJSConnectionError, KafkaJSNonRetriableError } = require('../../errors')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Cluster > ConnectionBuilder', () => {
  let builder: any

  const brokers = ['host.test:7777', 'host2.test:7778', 'host3.test:7779']
  const ssl = { ssl: true }
  const sasl = { sasl: true }
  const clientId = 'test-client-id'
  const connectionTimeout = 30000
  const logger = newLogger()
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
  const socketFactory = jest.fn()

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    builder = connectionBuilder({
      socketFactory,
      brokers,
      ssl,
      sasl,
      clientId,
      connectionTimeout,
      logger,
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('creates a new connection using a random broker', async () => {
    const connection = await builder.build()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connection).toBeInstanceOf(Connection)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connection.host).toBeOneOf(['host.test', 'host2.test', 'host3.test'])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connection.port).toBeOneOf([7777, 7778, 7779])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connection.ssl).toEqual(ssl)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connection.sasl).toEqual(sasl)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connection.clientId).toEqual(clientId)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connection.connectionTimeout).toEqual(connectionTimeout)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connection.logger).not.toBeFalsy()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connection.socketFactory).toBe(socketFactory)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('when called without host and port iterates throught the seed brokers', async () => {
    const connections = []
    for (let i = 0; i < brokers.length; i++) {
      const { host, port } = await builder.build()
      connections.push(`${host}:${port}`)
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connections).toIncludeSameMembers(brokers)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('accepts overrides for host, port and rack', async () => {
    const connection = await builder.build({
      host: 'host.another',
      port: 8888,
      rack: 'rack',
    })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connection.host).toEqual('host.another')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connection.port).toEqual(8888)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connection.rack).toEqual('rack')
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws an exception if brokers list is empty', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(
      connectionBuilder({
        socketFactory,
        brokers: [],
        ssl,
        sasl,
        clientId,
        connectionTimeout,
        logger,
      }).build()
    ).rejects.toEqual(new KafkaJSNonRetriableError('Failed to connect: brokers array is empty'))
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws an exception if brokers is null', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(
      connectionBuilder({
        socketFactory,
        brokers: null,
        ssl,
        sasl,
        clientId,
        connectionTimeout,
        logger,
      }).build()
    ).rejects.toEqual(
      new KafkaJSNonRetriableError('Failed to connect: brokers parameter should not be null')
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws an KafkaJSConnectionError if brokers is function and returning null', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(
      connectionBuilder({
        socketFactory,
        brokers: () => null,
        ssl,
        sasl,
        clientId,
        connectionTimeout,
        logger,
      }).build()
    ).rejects.toEqual(
      new KafkaJSConnectionError('Failed to connect: "config.brokers" returned void or empty array')
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws an KafkaJSConnectionError if brokers is function crashes', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(
      connectionBuilder({
        socketFactory,
        brokers: () => {
          throw new Error('oh a crash!')
        },
        ssl,
        sasl,
        clientId,
        connectionTimeout,
        logger,
      }).build()
    ).rejects.toEqual(
      new KafkaJSConnectionError('Failed to connect: "config.brokers" threw: oh a crash!')
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('brokers can be function that returns array of host:port strings', async () => {
    const builder = connectionBuilder({
      socketFactory,
      brokers: () => ['host.test:7777'],
      ssl,
      sasl,
      clientId,
      connectionTimeout,
      logger,
    })

    const connection = await builder.build()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connection).toBeInstanceOf(Connection)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connection.host).toBe('host.test')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connection.port).toBe(7777)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('brokers can be async function that returns array of host:port strings', async () => {
    const builder = connectionBuilder({
      socketFactory,
      brokers: async () => ['host.test:7777'],
      ssl,
      sasl,
      clientId,
      connectionTimeout,
      logger,
    })

    const connection = await builder.build()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connection).toBeInstanceOf(Connection)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connection.host).toBe('host.test')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(connection.port).toBe(7777)
  })
})
