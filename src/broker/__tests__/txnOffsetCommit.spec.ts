// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Broker'.
const Broker = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'COORDINATO... Remove this comment to see the full error message
const COORDINATOR_TYPES = require('../../protocol/coordinatorTypes')
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
  secureRandom,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTopi... Remove this comment to see the full error message
  createTopic,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createConn... Remove this comment to see the full error message
  createConnection,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'retryProto... Remove this comment to see the full error message
  retryProtocol,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Broker > TxnOffsetCommit', () => {
  let seedBroker: any,
    consumerBroker: any,
    transactionBroker: any,
    topicName: any,
    consumerGroupId: any,
    transactionalId: any,
    producerId: any,
    producerEpoch: any

  async function findBrokerForGroupId(groupId: any, coordinatorType: any) {
    const {
      coordinator: { host, port },
    } = await retryProtocol(
      'GROUP_COORDINATOR_NOT_AVAILABLE',
      async () =>
        await seedBroker.findGroupCoordinator({
          groupId,
          coordinatorType,
        })
    )

    return new Broker({
      connection: createConnection({ host, port }),
      logger: newLogger(),
    })
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    transactionalId = `transaction-id-${secureRandom()}`
    consumerGroupId = `group-id-${secureRandom()}`
    topicName = `test-topic-${secureRandom()}`

    seedBroker = new Broker({
      connection: createConnection(),
      logger: newLogger(),
    })

    await seedBroker.connect()
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName, partitions: 4 })

    transactionBroker = await findBrokerForGroupId(transactionalId, COORDINATOR_TYPES.TRANSACTION)
    await transactionBroker.connect()
    const result = await transactionBroker.initProducerId({
      transactionalId,
      transactionTimeout: 30000,
    })

    producerId = result.producerId
    producerEpoch = result.producerEpoch

    await transactionBroker.addPartitionsToTxn({
      transactionalId,
      producerId,
      producerEpoch,
      topics: [{ topic: topicName, partitions: [0, 1] }],
    })

    await transactionBroker.addOffsetsToTxn({
      transactionalId,
      producerId,
      producerEpoch,
      groupId: consumerGroupId,
    })

    consumerBroker = await findBrokerForGroupId(consumerGroupId, COORDINATOR_TYPES.GROUP)
    await consumerBroker.connect()
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    seedBroker && (await seedBroker.disconnect())
    transactionBroker && (await transactionBroker.disconnect())
    consumerBroker && (await consumerBroker.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const result = await consumerBroker.txnOffsetCommit({
      transactionalId,
      groupId: consumerGroupId,
      producerId,
      producerEpoch,
      topics: [
        {
          topic: topicName,
          partitions: [
            { partition: 0, offset: 0 },
            { partition: 1, offset: 0 },
          ],
        },
      ],
    })

    result.topics.forEach((topic: any) => topic.partitions.sort((p1: any, p2: any) => p1.partition - p2.partition))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(result).toEqual({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
      topics: [
        {
          topic: topicName,
          partitions: [
            { errorCode: 0, partition: 0 },
            { errorCode: 0, partition: 1 },
          ],
        },
      ],
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('ignores invalid transaction fields', async () => {
    await consumerBroker.txnOffsetCommit({
      transactionalId: 'foo',
      groupId: consumerGroupId,
      producerId: 999,
      producerEpoch: 999,
      topics: [
        {
          topic: topicName,
          partitions: [
            { partition: 0, offset: 0 },
            { partition: 1, offset: 0 },
          ],
        },
      ],
    })
  })
})
