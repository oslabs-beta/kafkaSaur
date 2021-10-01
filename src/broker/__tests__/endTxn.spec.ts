// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Broker'.
const Broker = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'COORDINATO... Remove this comment to see the full error message
const COORDINATOR_TYPES = require('../../protocol/coordinatorTypes')
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
  secureRandom,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createConn... Remove this comment to see the full error message
  createConnection,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'retryProto... Remove this comment to see the full error message
  retryProtocol,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTopi... Remove this comment to see the full error message
  createTopic,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSPro... Remove this comment to see the full error message
const { KafkaJSProtocolError } = require('../../errors')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Broker > EndTxn', () => {
  let transactionBroker: any, seedBroker: any, transactionalId: any, producerId: any, producerEpoch: any, topicName

  function addPartitionsToTxn() {
    return transactionBroker.addOffsetsToTxn({
      transactionalId,
      producerId,
      producerEpoch,
      groupId: `group-id-${secureRandom()}`,
    })
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    transactionalId = `transactional-id-${secureRandom()}`
    topicName = `test-topic-${secureRandom()}`

    seedBroker = new Broker({
      connection: createConnection(),
      logger: newLogger(),
    })

    await seedBroker.connect()
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName, partitions: 4 })

    const {
      coordinator: { host, port },
    } = await retryProtocol(
      'GROUP_COORDINATOR_NOT_AVAILABLE',
      async () =>
        await seedBroker.findGroupCoordinator({
          groupId: transactionalId,
          coordinatorType: COORDINATOR_TYPES.TRANSACTION,
        })
    )

    transactionBroker = new Broker({
      connection: createConnection({ host, port }),
      logger: newLogger(),
    })

    await transactionBroker.connect()

    const result = await transactionBroker.initProducerId({
      transactionalId,
      transactionTimeout: 30000,
    })

    producerId = result.producerId
    producerEpoch = result.producerEpoch
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    seedBroker && (await seedBroker.disconnect())
    transactionBroker && (await transactionBroker.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('commit transaction', async () => {
    await addPartitionsToTxn()

    const result = await transactionBroker.endTxn({
      transactionalId,
      producerId,
      producerEpoch,
      transactionResult: true, // Commit
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(result).toEqual({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
      errorCode: 0,
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('abort transaction', async () => {
    await addPartitionsToTxn()

    const result = await transactionBroker.endTxn({
      transactionalId,
      producerId,
      producerEpoch,
      transactionResult: false, // Abort
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(result).toEqual({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
      errorCode: 0,
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('throws if transaction is in invalid state (eg have not yet added partitions to transaction)', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(
      transactionBroker.endTxn({
        transactionalId,
        producerId,
        producerEpoch,
        transactionResult: true,
      })
    ).rejects.toEqual(
      new KafkaJSProtocolError(
        'The producer attempted a transactional operation in an invalid state'
      )
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('throws for incorrect transactional id', async () => {
    await addPartitionsToTxn()

    let error

    try {
      await transactionBroker.endTxn({
        transactionalId: 'foobar',
        producerId,
        producerEpoch,
        transactionResult: true,
      })
    } catch (e) {
      error = e
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error).toBeDefined()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect([
      new KafkaJSProtocolError(
        'The producer attempted to use a producer id which is not currently assigned to its transactional id'
      ),
      new KafkaJSProtocolError('This is not the correct coordinator for this group'),
    ]).toContainEqual(error)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('throws for incorrect producer id', async () => {
    await addPartitionsToTxn()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(
      transactionBroker.endTxn({
        transactionalId,
        producerId: 12345,
        producerEpoch,
        transactionResult: true,
      })
    ).rejects.toEqual(
      new KafkaJSProtocolError(
        'The producer attempted to use a producer id which is not currently assigned to its transactional id'
      )
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('throws for incorrect producer epoch', async () => {
    await addPartitionsToTxn()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(
      transactionBroker.endTxn({
        transactionalId,
        producerId,
        producerEpoch: producerEpoch + 1,
        transactionResult: true,
      })
    ).rejects.toEqual(
      new KafkaJSProtocolError(
        "Producer attempted an operation with an old epoch. Either there is a newer producer with the same transactionalId, or the producer's transaction has been expired by the broker"
      )
    )
  })
})
