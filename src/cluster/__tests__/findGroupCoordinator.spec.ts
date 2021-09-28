// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.mock('../../utils/shuffle')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'shuffle'.
const shuffle = require('../../utils/shuffle')
shuffle.mockImplementation((brokers: any) => brokers.sort((a: any, b: any) => a > b))

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Broker'.
const Broker = require('../../broker')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
const { createCluster, secureRandom } = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSBro... Remove this comment to see the full error message
const { KafkaJSBrokerNotFound, KafkaJSConnectionError } = require('../../errors')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'COORDINATO... Remove this comment to see the full error message
const COORDINATOR_TYPES = require('../../protocol/coordinatorTypes')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Cluster > findGroupCoordinator', () => {
  let cluster: any, groupId: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    cluster = createCluster()
    await cluster.connect()
    await cluster.refreshMetadata()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.spyOn(Broker.prototype, 'findGroupCoordinator')
    groupId = `test-group-${secureRandom()}`
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    cluster && (await cluster.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('find the group coordinator', async () => {
    const broker = await cluster.findGroupCoordinator({ groupId })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(Broker.prototype.findGroupCoordinator).toHaveBeenCalledWith({
      groupId,
      coordinatorType: COORDINATOR_TYPES.GROUP,
    })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(broker).not.toBeFalsy()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('find the coordinator if transactional', async () => {
    const broker = await cluster.findGroupCoordinator({
      groupId,
      coordinatorType: COORDINATOR_TYPES.TRANSACTION,
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(Broker.prototype.findGroupCoordinator).toHaveBeenCalledWith({
      groupId,
      coordinatorType: COORDINATOR_TYPES.TRANSACTION,
    })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(broker).not.toBeFalsy()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('refresh the metadata and try again in case of broker not found', async () => {
    const firstNodeId = Object.keys(cluster.brokerPool.brokers)[0]
    const firstNode = cluster.brokerPool.brokers[firstNodeId]

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    cluster.brokerPool.findBroker = jest
      .fn()
      .mockImplementationOnce(() => {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
        throw new KafkaJSBrokerNotFound('Not found')
      })
      .mockImplementation(() => firstNode)

    const coordinator = await cluster.findGroupCoordinator({ groupId })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(coordinator).toEqual(firstNode)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.brokerPool.findBroker).toHaveBeenCalledTimes(4)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('attempt to find coordinator across all brokers until one is found', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.spyOn(cluster.brokerPool.brokers[0], 'findGroupCoordinator').mockImplementation(() => {
      throw new KafkaJSConnectionError('Something went wrong')
    })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.spyOn(cluster.brokerPool.brokers[1], 'findGroupCoordinator').mockImplementation(() => {
      throw new KafkaJSConnectionError('Something went wrong')
    })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest
      .spyOn(cluster.brokerPool.brokers[2], 'findGroupCoordinator')
      .mockImplementation(() => ({ coordinator: { nodeId: 2 } }))

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(cluster.findGroupCoordinator({ groupId })).resolves.toEqual(
      cluster.brokerPool.brokers[2]
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('retry on ECONNREFUSED', async () => {
    const broker = await cluster.findGroupCoordinator({ groupId })
    await broker.disconnect()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.spyOn(broker, 'connect').mockImplementationOnce(() => {
      throw new KafkaJSConnectionError(`Connection error: connect ECONNREFUSED <ip>:<port>`, {
        code: 'ECONNREFUSED',
      })
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(cluster.findGroupCoordinator({ groupId })).resolves.toBeTruthy()
  })
})
