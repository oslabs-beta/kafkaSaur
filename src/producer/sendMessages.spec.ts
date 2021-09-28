// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.mock('./groupMessagesPerPartition')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
const { newLogger } = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errorCodes... Remove this comment to see the full error message
const { errorCodes, createErrorFromCode } = require('../protocol/error')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const retry = require('../retry')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createSend... Remove this comment to see the full error message
const createSendMessages = require('./sendMessages')

// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'topicName' implicitly has an 'any' type... Remove this comment to see the full error message
const createProducerResponse = (topicName, partition) => ({
  topics: [
    {
      topicName,
      partitions: [
        {
          errorCode: 0,
          offset: `${partition}`,
          partition,
          timestamp: '-1',
        },
      ],
    },
  ]
})

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Producer > sendMessages', () => {
  const topic = 'topic-name'
  const partitionsPerLeader = {
    1: [0],
    2: [1],
    3: [2],
  }
  let mockProducerId: any, mockProducerEpoch: any, mockTransactionalId: any

  let messages: any,
    partitioner: any,
    brokers: any,
    cluster: any,
    messagesPerPartition: any,
    topicPartitionMetadata: any,
    eosManager: any,
    retrier: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    messages = []
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    partitioner = jest.fn()
    brokers = {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      1: { nodeId: 1, produce: jest.fn(() => createProducerResponse(topic, 0)) },
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      2: { nodeId: 2, produce: jest.fn(() => createProducerResponse(topic, 1)) },
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      3: { nodeId: 3, produce: jest.fn(() => createProducerResponse(topic, 2)) },
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      4: { nodeId: 4, produce: jest.fn(() => createProducerResponse(topic, 1)) },
    }
    topicPartitionMetadata = [
      {
        isr: [2],
        leader: 1,
        partitionErrorCode: 0,
        partitionId: 0,
        replicas: [2],
      },
    ]

    cluster = {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      addMultipleTargetTopics: jest.fn(),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      refreshMetadata: jest.fn(),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      refreshMetadataIfNecessary: jest.fn(),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      findTopicPartitionMetadata: jest.fn(() => topicPartitionMetadata),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      findLeaderForPartitions: jest.fn(() => partitionsPerLeader),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      findBroker: jest.fn(({
        nodeId
      }: any) => brokers[nodeId]),
      // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Set'. Do you need to change your... Remove this comment to see the full error message
      targetTopics: new Set(),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      isConnected: jest.fn(() => true),
    }
    messagesPerPartition = {
      '0': [{ key: '3' }, { key: '6' }, { key: '9' }],
      '1': [{ key: '1' }, { key: '4' }, { key: '7' }],
      '2': [{ key: '2' }, { key: '5' }, { key: '8' }],
    }

    mockProducerId = -1
    mockProducerEpoch = -1
    mockTransactionalId = undefined

    eosManager = {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      getProducerId: jest.fn(() => mockProducerId),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      getProducerEpoch: jest.fn(() => mockProducerEpoch),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      getSequence: jest.fn(() => 0),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      getTransactionalId: jest.fn(() => mockTransactionalId),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      updateSequence: jest.fn(),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      isTransactional: jest.fn().mockReturnValue(false),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      addPartitionsToTransaction: jest.fn(),
    }

    retrier = retry({ retries: 5 })

    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    require('./groupMessagesPerPartition').mockImplementation(() => messagesPerPartition)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('only retry failed brokers', async () => {
    const sendMessages = createSendMessages({
      retrier,
      logger: newLogger(),
      cluster,
      partitioner,
      eosManager,
    })

    brokers[1].produce
      .mockImplementationOnce(() => {
        throw createErrorFromCode(5)
      })
      .mockImplementationOnce(() => createProducerResponse(topic, 0))

    brokers[3].produce
      .mockImplementationOnce(() => {
        throw createErrorFromCode(5)
      })
      .mockImplementationOnce(() => {
        throw createErrorFromCode(5)
      })
      .mockImplementationOnce(() => createProducerResponse(topic, 2))

    const response = await sendMessages({ topicMessages: [{ topic, messages }] })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.refreshMetadataIfNecessary).toHaveBeenCalled()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.addPartitionsToTransaction).not.toHaveBeenCalled()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(brokers[1].produce).toHaveBeenCalledTimes(2)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(brokers[2].produce).toHaveBeenCalledTimes(1)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(brokers[3].produce).toHaveBeenCalledTimes(3)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response).toEqual([
      { errorCode: 0, offset: '1', partition: 1, timestamp: '-1', topicName: 'topic-name' },
      { errorCode: 0, offset: '0', partition: 0, timestamp: '-1', topicName: 'topic-name' },
      { errorCode: 0, offset: '2', partition: 2, timestamp: '-1', topicName: 'topic-name' },
    ])
  })

  const PRODUCE_ERRORS = [
    'UNKNOWN_TOPIC_OR_PARTITION',
    'LEADER_NOT_AVAILABLE',
    'NOT_LEADER_FOR_PARTITION',
  ]

  for (const errorType of PRODUCE_ERRORS) {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test(`refresh stale metadata on ${errorType}`, async () => {
      const sendMessages = createSendMessages({
        retrier,
        logger: newLogger(),
        cluster,
        partitioner,
        eosManager,
      })
      brokers[1].produce
        .mockImplementationOnce(() => {
          throw createErrorFromCode(errorCodes.find(({
            type
          }: any) => type === errorType).code)
        })
        .mockImplementationOnce(() => createProducerResponse(topic, 0))

      await sendMessages({ topicMessages: [{ topic, messages }] })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokers[1].produce).toHaveBeenCalledTimes(2)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(cluster.refreshMetadata).toHaveBeenCalled()
    })
  }

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('does not re-produce messages to brokers that are no longer leaders after metadata refresh', async () => {
    const sendMessages = createSendMessages({
      retrier,
      logger: newLogger(),
      cluster,
      partitioner,
      eosManager,
    })

    brokers[2].produce
      .mockImplementationOnce(() => {
        throw createErrorFromCode(
          errorCodes.find(({
            type
          }: any) => type === 'NOT_LEADER_FOR_PARTITION').code
        )
      })
      .mockImplementationOnce(() => createProducerResponse(topic, 0))
    cluster.findLeaderForPartitions
      .mockImplementationOnce(() => partitionsPerLeader)
      .mockImplementationOnce(() => ({
        1: [0],
        4: [1], // Broker 4 replaces broker 2 as leader for partition 1
        3: [2],
      }))

    const response = await sendMessages({ topicMessages: [{ topic, messages }] })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response).toEqual([
      { errorCode: 0, offset: '0', partition: 0, timestamp: '-1', topicName: 'topic-name' },
      { errorCode: 0, offset: '2', partition: 2, timestamp: '-1', topicName: 'topic-name' },
      { errorCode: 0, offset: '1', partition: 1, timestamp: '-1', topicName: 'topic-name' },
    ])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('refreshes metadata if partition metadata is empty', async () => {
    const sendMessages = createSendMessages({
      retrier,
      logger: newLogger(),
      cluster,
      partitioner,
      eosManager,
    })

    cluster.findTopicPartitionMetadata
      .mockImplementationOnce(() => [])
      .mockImplementationOnce(() => topicPartitionMetadata)

    await sendMessages({ topicMessages: [{ topic, messages }] })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.refreshMetadata).toHaveBeenCalled()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('retrieves sequence information from the transaction manager and updates', async () => {
    const sendMessages = createSendMessages({
      retrier,
      logger: newLogger(),
      cluster,
      partitioner,
      eosManager,
    })

    eosManager.getSequence.mockReturnValue(5)

    cluster.findTopicPartitionMetadata
      .mockImplementationOnce(() => [])
      .mockImplementationOnce(() => topicPartitionMetadata)

    await sendMessages({
      topicMessages: [{ topic, messages }],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(brokers[1].produce.mock.calls[0][0].topicData[0].partitions[0]).toHaveProperty(
      'firstSequence',
      5
    )
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(brokers[2].produce.mock.calls[0][0].topicData[0].partitions[0]).toHaveProperty(
      'firstSequence',
      5
    )
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(brokers[3].produce.mock.calls[0][0].topicData[0].partitions[0]).toHaveProperty(
      'firstSequence',
      5
    )

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.updateSequence).toHaveBeenCalledWith(
      'topic-name',
      0,
      messagesPerPartition[0].length
    )
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.updateSequence).toHaveBeenCalledWith(
      'topic-name',
      1,
      messagesPerPartition[1].length
    )
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.updateSequence).toHaveBeenCalledWith(
      'topic-name',
      2,
      messagesPerPartition[2].length
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('adds partitions to the transaction if transactional', async () => {
    const sendMessages = createSendMessages({
      retrier,
      logger: newLogger(),
      cluster,
      partitioner,
      eosManager,
    })

    cluster.findTopicPartitionMetadata
      .mockImplementationOnce(() => [])
      .mockImplementationOnce(() => topicPartitionMetadata)

    eosManager.isTransactional.mockReturnValue(true)

    await sendMessages({
      topicMessages: [{ topic, messages }],
    })

    const numTargetBrokers = 3
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.addPartitionsToTransaction).toHaveBeenCalledTimes(numTargetBrokers)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.addPartitionsToTransaction).toHaveBeenCalledWith([
      {
        topic: 'topic-name',
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        partitions: [expect.objectContaining({ partition: 0 })],
      },
    ])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.addPartitionsToTransaction).toHaveBeenCalledWith([
      {
        topic: 'topic-name',
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        partitions: [expect.objectContaining({ partition: 1 })],
      },
    ])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eosManager.addPartitionsToTransaction).toHaveBeenCalledWith([
      {
        topic: 'topic-name',
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        partitions: [expect.objectContaining({ partition: 2 })],
      },
    ])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('if transactional produces with the transactional id and producer id & epoch', async () => {
    const sendMessages = createSendMessages({
      retrier,
      logger: newLogger(),
      cluster,
      partitioner,
      eosManager,
    })

    cluster.findTopicPartitionMetadata
      .mockImplementationOnce(() => [])
      .mockImplementationOnce(() => topicPartitionMetadata)

    eosManager.isTransactional.mockReturnValue(true)

    mockProducerId = 1000
    mockProducerEpoch = 1
    mockTransactionalId = 'transactionalid'

    await sendMessages({
      topicMessages: [{ topic, messages }],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(brokers[1].produce).toHaveBeenCalledWith(
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect.objectContaining({
        producerId: mockProducerId,
        transactionalId: mockTransactionalId,
        producerEpoch: mockProducerEpoch,
      })
    )
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(brokers[3].produce).toHaveBeenCalledWith(
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect.objectContaining({
        producerId: mockProducerId,
        transactionalId: mockTransactionalId,
        producerEpoch: mockProducerEpoch,
      })
    )
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(brokers[3].produce).toHaveBeenCalledWith(
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect.objectContaining({
        producerId: mockProducerId,
        transactionalId: mockTransactionalId,
        producerEpoch: mockProducerEpoch,
      })
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('if idempotent produces with the producer id & epoch without the transactional id', async () => {
    const sendMessages = createSendMessages({
      retrier,
      logger: newLogger(),
      cluster,
      partitioner,
      eosManager,
    })

    cluster.findTopicPartitionMetadata
      .mockImplementationOnce(() => [])
      .mockImplementationOnce(() => topicPartitionMetadata)

    eosManager.isTransactional.mockReturnValue(false)

    mockProducerId = 1000
    mockProducerEpoch = 1
    mockTransactionalId = 'transactionalid'

    await sendMessages({
      topicMessages: [{ topic, messages }],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(brokers[1].produce).toHaveBeenCalledWith(
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect.objectContaining({
        producerId: mockProducerId,
        transactionalId: undefined,
        producerEpoch: mockProducerEpoch,
      })
    )
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(brokers[3].produce).toHaveBeenCalledWith(
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect.objectContaining({
        producerId: mockProducerId,
        transactionalId: undefined,
        producerEpoch: mockProducerEpoch,
      })
    )
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(brokers[3].produce).toHaveBeenCalledWith(
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect.objectContaining({
        producerId: mockProducerId,
        transactionalId: undefined,
        producerEpoch: mockProducerEpoch,
      })
    )
  })
})
