// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
const { newLogger } = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createEosM... Remove this comment to see the full error message
const createEosManager = require('.')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSNon... Remove this comment to see the full error message
const { KafkaJSNonRetriableError } = require('../../errors')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'COORDINATO... Remove this comment to see the full error message
const COORDINATOR_TYPES = require('../../protocol/coordinatorTypes')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Producer > eosManager', () => {
  const topic = 'topic-name'
  const producerId = 1000
  const producerEpoch = 1
  const mockInitProducerIdResponse = {
    producerId,
    producerEpoch,
  }

  let cluster: any, broker: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    broker = {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      initProducerId: jest.fn().mockReturnValue(mockInitProducerIdResponse),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      addPartitionsToTxn: jest.fn(),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      endTxn: jest.fn(),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      addOffsetsToTxn: jest.fn(),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      txnOffsetCommit: jest.fn(),
    }
    cluster = {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      refreshMetadataIfNecessary: jest.fn(),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      findGroupCoordinator: jest.fn().mockReturnValue(broker),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      findControllerBroker: jest.fn().mockReturnValue(broker),
    }
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('initializing the producer id and epoch', async () => {
    const eosManager = createEosManager({
      logger: newLogger(),
      cluster,
      transactionTimeout: 30000,
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.getProducerId()).toEqual(-1)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.getProducerEpoch()).toEqual(0)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.getSequence(topic, 1)).toEqual(0)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.isInitialized()).toEqual(false)

    await eosManager.initProducerId()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.refreshMetadataIfNecessary).toHaveBeenCalled()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(broker.initProducerId).toHaveBeenCalledWith({ transactionTimeout: 30000 })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.getProducerId()).toEqual(mockInitProducerIdResponse.producerId)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.getProducerEpoch()).toEqual(mockInitProducerIdResponse.producerEpoch)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.isInitialized()).toEqual(true)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('getting & updating the sequence per topic-partition', async () => {
    const eosManager = createEosManager({ logger: newLogger(), cluster })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.getSequence(topic, 1)).toEqual(0)
    eosManager.updateSequence(topic, 1, 10) // No effect if we haven't initialized
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.getSequence(topic, 1)).toEqual(0)

    await eosManager.initProducerId()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.getSequence(topic, 1)).toEqual(0)
    eosManager.updateSequence(topic, 1, 5)
    eosManager.updateSequence(topic, 1, 10)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.getSequence(topic, 1)).toEqual(15)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.getSequence(topic, 2)).toEqual(0) // Different partition
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.getSequence('foobar', 1)).toEqual(0) // Different topic

    eosManager.updateSequence(topic, 3, Math.pow(2, 32) - 100)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.getSequence(topic, 3)).toEqual(Math.pow(2, 32) - 100) // Rotates once we reach 2 ^ 32 (max Int32)
    eosManager.updateSequence(topic, 3, 100)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.getSequence(topic, 3)).toEqual(0) // Rotates once we reach 2 ^ 32 (max Int32)

    await eosManager.initProducerId()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.getSequence(topic, 1)).toEqual(0) // Sequences reset by initProducerId
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('if transactional=true', () => {
    let transactionalId: any

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      transactionalId = `transactional-id`
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('initializing the producer id and epoch with the transactional id', async () => {
      const eosManager = createEosManager({
        logger: newLogger(),
        cluster,
        transactionTimeout: 30000,
        transactional: true,
        transactionalId,
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(eosManager.getProducerId()).toEqual(-1)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(eosManager.getProducerEpoch()).toEqual(0)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(eosManager.getSequence(topic, 1)).toEqual(0)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(eosManager.isInitialized()).toEqual(false)

      await eosManager.initProducerId()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.refreshMetadataIfNecessary).toHaveBeenCalled()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.findGroupCoordinator).toHaveBeenCalledWith({
        groupId: transactionalId,
        coordinatorType: COORDINATOR_TYPES.TRANSACTION,
      })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.initProducerId).toHaveBeenCalledWith({
        transactionalId,
        transactionTimeout: 30000,
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(eosManager.getProducerId()).toEqual(mockInitProducerIdResponse.producerId)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(eosManager.getProducerEpoch()).toEqual(mockInitProducerIdResponse.producerEpoch)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(eosManager.isInitialized()).toEqual(true)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('adding partitions to transaction', async () => {
      const eosManager = createEosManager({
        logger: newLogger(),
        cluster,
        transactionalId,
        transactional: true,
      })
      await eosManager.initProducerId()
      eosManager.beginTransaction()

      const topicData = [
        {
          topic: 'test-1',
          partitions: [{ partition: 1 }, { partition: 2 }],
        },
        {
          topic: 'test-2',
          partitions: [{ partition: 1 }],
        },
      ]

      cluster.findGroupCoordinator.mockClear()
      await eosManager.addPartitionsToTransaction(topicData)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.findGroupCoordinator).toHaveBeenCalledWith({
        groupId: transactionalId,
        coordinatorType: COORDINATOR_TYPES.TRANSACTION,
      })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.addPartitionsToTxn).toHaveBeenCalledTimes(1)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.addPartitionsToTxn).toHaveBeenCalledWith({
        transactionalId,
        producerId,
        producerEpoch,
        topics: [
          {
            topic: 'test-1',
            partitions: [1, 2],
          },
          {
            topic: 'test-2',
            partitions: [1],
          },
        ],
      })

      broker.addPartitionsToTxn.mockClear()
      await eosManager.addPartitionsToTransaction(topicData)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.addPartitionsToTxn).toHaveBeenCalledTimes(0) // No call if nothing new

      broker.addPartitionsToTxn.mockClear()
      await eosManager.addPartitionsToTransaction([
        ...topicData,
        { topic: 'test-2', partitions: [{ partition: 2 }] },
        { topic: 'test-3', partitions: [{ partition: 1 }] },
      ])
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.addPartitionsToTxn).toHaveBeenCalledTimes(1) // Called if some new
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.addPartitionsToTxn).toHaveBeenCalledWith({
        transactionalId,
        producerId,
        producerEpoch,
        topics: [
          {
            topic: 'test-2',
            partitions: [2],
          },
          {
            topic: 'test-3',
            partitions: [1],
          },
        ],
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('committing a transaction', async () => {
      const eosManager = createEosManager({
        logger: newLogger(),
        cluster,
        transactionTimeout: 30000,
        transactional: true,
        transactionalId,
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(eosManager.commit()).rejects.toEqual(
        new KafkaJSNonRetriableError(
          'Transaction state exception: Cannot call "commit" in state "UNINITIALIZED"'
        )
      )
      await eosManager.initProducerId()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(eosManager.commit()).rejects.toEqual(
        new KafkaJSNonRetriableError(
          'Transaction state exception: Cannot call "commit" in state "READY"'
        )
      )
      await eosManager.beginTransaction()

      cluster.findGroupCoordinator.mockClear()
      await eosManager.commit()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.findGroupCoordinator).toHaveBeenCalledWith({
        groupId: transactionalId,
        coordinatorType: COORDINATOR_TYPES.TRANSACTION,
      })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.endTxn).toHaveBeenCalledWith({
        producerId,
        producerEpoch,
        transactionalId,
        transactionResult: true,
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('aborting a transaction', async () => {
      const eosManager = createEosManager({
        logger: newLogger(),
        cluster,
        transactionTimeout: 30000,
        transactional: true,
        transactionalId,
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(eosManager.abort()).rejects.toEqual(
        new KafkaJSNonRetriableError(
          'Transaction state exception: Cannot call "abort" in state "UNINITIALIZED"'
        )
      )
      await eosManager.initProducerId()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(eosManager.abort()).rejects.toEqual(
        new KafkaJSNonRetriableError(
          'Transaction state exception: Cannot call "abort" in state "READY"'
        )
      )
      await eosManager.beginTransaction()

      cluster.findGroupCoordinator.mockClear()
      await eosManager.abort()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.findGroupCoordinator).toHaveBeenCalledWith({
        groupId: transactionalId,
        coordinatorType: COORDINATOR_TYPES.TRANSACTION,
      })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.endTxn).toHaveBeenCalledWith({
        producerId,
        producerEpoch,
        transactionalId,
        transactionResult: false,
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('sending offsets', async () => {
      const consumerGroupId = 'consumer-group-id'
      const topics = [{ topic: 'test-topic-1', partitions: [{ partition: 0 }] }]
      const eosManager = createEosManager({
        logger: newLogger(),
        cluster,
        transactionTimeout: 30000,
        transactional: true,
        transactionalId,
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(eosManager.sendOffsets()).rejects.toEqual(
        new KafkaJSNonRetriableError(
          'Transaction state exception: Cannot call "sendOffsets" in state "UNINITIALIZED"'
        )
      )
      await eosManager.initProducerId()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(eosManager.sendOffsets()).rejects.toEqual(
        new KafkaJSNonRetriableError(
          'Transaction state exception: Cannot call "sendOffsets" in state "READY"'
        )
      )
      await eosManager.beginTransaction()

      cluster.findGroupCoordinator.mockClear()

      await eosManager.sendOffsets({ consumerGroupId, topics })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.findGroupCoordinator).toHaveBeenCalledWith({
        groupId: consumerGroupId,
        coordinatorType: COORDINATOR_TYPES.GROUP,
      })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.addOffsetsToTxn).toHaveBeenCalledWith({
        producerId,
        producerEpoch,
        transactionalId,
        groupId: consumerGroupId,
      })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.txnOffsetCommit).toHaveBeenCalledWith({
        transactionalId,
        producerId,
        producerEpoch,
        groupId: consumerGroupId,
        topics,
      })
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('if transactional=false', () => {
    let eosManager: any

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(async () => {
      eosManager = createEosManager({ logger: newLogger(), cluster })
      await eosManager.initProducerId()
    })

    function testTransactionalGuardAsync(method: any) {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test(`${method} throws`, async () => {
        const eosManager = createEosManager({ logger: newLogger(), cluster })

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(eosManager[method]()).rejects.toEqual(
          new KafkaJSNonRetriableError(
            `Transaction state exception: Cannot call "${method}" in state "UNINITIALIZED"`
          )
        )
      })
    }

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test(`beginTransaction throws`, async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => eosManager.beginTransaction()).toThrow(
        new KafkaJSNonRetriableError('Method unavailable if non-transactional')
      )
    })

    testTransactionalGuardAsync('addPartitionsToTransaction')
    testTransactionalGuardAsync('sendOffsets')
    testTransactionalGuardAsync('commit')
    testTransactionalGuardAsync('abort')
  })
})
