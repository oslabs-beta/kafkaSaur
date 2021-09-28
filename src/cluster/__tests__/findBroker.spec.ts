const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
  createCluster,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
  secureRandom,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTopi... Remove this comment to see the full error message
  createTopic,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createConn... Remove this comment to see the full error message
  createConnection,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Broker'.
const Broker = require('../../broker')
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSLoc... Remove this comment to see the full error message
  KafkaJSLockTimeout,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSCon... Remove this comment to see the full error message
  KafkaJSConnectionError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSBro... Remove this comment to see the full error message
  KafkaJSBrokerNotFound,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../errors')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Cluster > findBroker', () => {
  let cluster: any, topic

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topic = `test-topic-${secureRandom()}`
    cluster = createCluster()

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic })
    await cluster.connect()
    await cluster.addTargetTopic(topic)
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    cluster && (await cluster.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('returns the broker given by the broker pool', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    cluster.brokerPool.findBroker = jest.fn()
    const nodeId = 1
    await cluster.findBroker({ nodeId })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.brokerPool.findBroker).toHaveBeenCalledWith({ nodeId })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('refresh metadata on lock timeout', async () => {
    const nodeId = 0
    const mockBroker = new Broker({
      connection: createConnection(),
      logger: newLogger(),
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.spyOn(mockBroker, 'connect').mockImplementationOnce(() => {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
      throw new KafkaJSLockTimeout('Timeout while acquiring lock')
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.spyOn(cluster, 'refreshMetadata')
    cluster.brokerPool.brokers[nodeId] = mockBroker

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(cluster.findBroker({ nodeId })).rejects.toHaveProperty(
      'name',
      'KafkaJSLockTimeout'
    )

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(cluster.findBroker({ nodeId })).resolves.toBeInstanceOf(Broker)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.refreshMetadata).toHaveBeenCalled()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('refresh metadata on KafkaJSConnectionError ECONNREFUSED', async () => {
    const nodeId = 0
    const mockBroker = new Broker({
      connection: createConnection(),
      logger: newLogger(),
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.spyOn(mockBroker, 'connect').mockImplementationOnce(() => {
      throw new KafkaJSConnectionError('Connection error: ECONNREFUSED', { code: 'ECONNREFUSED' })
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.spyOn(cluster, 'refreshMetadata')
    cluster.brokerPool.brokers[nodeId] = mockBroker

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(cluster.findBroker({ nodeId })).rejects.toHaveProperty(
      'name',
      'KafkaJSConnectionError'
    )

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(cluster.findBroker({ nodeId })).resolves.toBeInstanceOf(Broker)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.refreshMetadata).toHaveBeenCalled()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('refresh metadata on KafkaJSBrokerNotFound', async () => {
    const nodeId = 0
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    cluster.brokerPool.findBroker = jest.fn(() => {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
      throw new KafkaJSBrokerNotFound('Broker not found')
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.spyOn(cluster, 'refreshMetadata')

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(cluster.findBroker({ nodeId })).rejects.toHaveProperty(
      'name',
      'KafkaJSBrokerNotFound'
    )

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.refreshMetadata).toHaveBeenCalled()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('refresh metadata on KafkaJSConnectionError Connection Timeout', async () => {
    const nodeId = 0
    const mockBroker = new Broker({
      connection: createConnection(),
      logger: newLogger(),
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.spyOn(mockBroker, 'connect').mockImplementationOnce(() => {
      throw new KafkaJSConnectionError('Connection timeout', { broker: mockBroker })
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.spyOn(cluster, 'refreshMetadata')
    cluster.brokerPool.brokers[nodeId] = mockBroker

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(cluster.findBroker({ nodeId })).rejects.toHaveProperty(
      'name',
      'KafkaJSConnectionError'
    )

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(cluster.findBroker({ nodeId })).resolves.toBeInstanceOf(Broker)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.refreshMetadata).toHaveBeenCalled()
  })
})
