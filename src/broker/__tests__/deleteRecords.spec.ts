// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Broker'.
const Broker = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createProd... Remove this comment to see the full error message
const createProducer = require('../../producer')

const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
  createCluster,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTopi... Remove this comment to see the full error message
  createTopic,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
  secureRandom,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createModP... Remove this comment to see the full error message
  createModPartitioner,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createConn... Remove this comment to see the full error message
  createConnection,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'retryProto... Remove this comment to see the full error message
  retryProtocol,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSPro... Remove this comment to see the full error message
const { KafkaJSProtocolError } = require('../../errors.js')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Broker > deleteRecords', () => {
  let topicName: any, cluster: any, seedBroker: any, producer: any, broker: any, metadata: any, partitionLeader: any, recordsToDelete: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topicName = `test-topic-${secureRandom()}`

    cluster = createCluster()

    seedBroker = new Broker({
      connection: createConnection(),
      logger: newLogger(),
    })

    producer = createProducer({
      cluster,
      createPartitioner: createModPartitioner,
      logger: newLogger(),
    })

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName })

    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all([seedBroker.connect(), producer.connect()])

    metadata = await retryProtocol(
      'LEADER_NOT_AVAILABLE',
      async () => await seedBroker.metadata([topicName])
    )
    partitionLeader = metadata.topicMetadata[0].partitionMetadata[0].leader

    const messages = Array(10)
      // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
      .fill()
      .map(() => {
        const value = secureRandom()
        return { key: `key-${value}`, value: `value-${value}` }
      })

    await producer.send({ acks: 1, topic: topicName, messages })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(
      await cluster.fetchTopicsOffset([
        {
          topic: topicName,
          partitions: [{ partition: 0 }],
          fromBeginning: false,
        },
      ])
    ).toEqual(
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect.arrayContaining([
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.objectContaining({
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          partitions: expect.arrayContaining([expect.objectContaining({ offset: '10' })]),
        }),
      ])
    )

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(
      await cluster.fetchTopicsOffset([
        {
          topic: topicName,
          partitions: [{ partition: 0 }],
          fromBeginning: true,
        },
      ])
    ).toEqual(
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect.arrayContaining([
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.objectContaining({
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          partitions: expect.arrayContaining([expect.objectContaining({ offset: '0' })]),
        }),
      ])
    )

    recordsToDelete = [
      {
        topic: topicName,
        partitions: [
          {
            partition: 0,
            offset: '7',
          },
        ],
      },
    ]
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    producer && (await producer.disconnect())
    seedBroker && (await seedBroker.disconnect())
    broker && (await broker.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const brokerData = metadata.brokers.find((b: any) => b.nodeId === partitionLeader)

    broker = new Broker({
      connection: createConnection(brokerData),
      logger: newLogger(),
    })
    await broker.connect()

    const response = await broker.deleteRecords({ topics: recordsToDelete })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response).toEqual({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
      topics: [
        {
          topic: topicName,
          partitions: [
            {
              partition: 0,
              // @ts-expect-error ts-migrate(2737) FIXME: BigInt literals are not available when targeting l... Remove this comment to see the full error message
              lowWatermark: 7n,
              errorCode: 0,
            },
          ],
        },
      ],
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('rejects the promise when offset is incorrect', async () => {
    recordsToDelete[0].partitions[0].offset = '11'
    const brokerData = metadata.brokers.find((b: any) => b.nodeId === partitionLeader)
    broker = new Broker({
      connection: createConnection(brokerData),
      logger: newLogger(),
    })
    await broker.connect()

    let error
    try {
      await broker.deleteRecords({ topics: recordsToDelete })
    } catch (e) {
      error = e
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error).toBeDefined()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error.name).toBe('KafkaJSDeleteTopicRecordsError')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error.partitions[0].error).toStrictEqual(
      new KafkaJSProtocolError(
        'The requested offset is not within the range of offsets maintained by the server'
      )
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('rejects the promise when broker is not the partition leader', async () => {
    const brokerData = metadata.brokers.find((b: any) => b.nodeId !== partitionLeader)
    broker = new Broker({
      connection: createConnection(brokerData),
      logger: newLogger(),
    })
    await broker.connect()

    let error
    try {
      await broker.deleteRecords({ topics: recordsToDelete })
    } catch (e) {
      error = e
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error).toBeDefined()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error.name).toBe('KafkaJSDeleteTopicRecordsError')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error.partitions[0].error).toStrictEqual(
      new KafkaJSProtocolError('This server is not the leader for that topic-partition')
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when the broker has multiple partitions', () => {
    let secondTopicName: any, testPartitions: any

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(async () => {
      partitionLeader = 0
      secondTopicName = `test-topic-${secureRandom()}`

      // 3 partitions per broker
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: secondTopicName, partitions: 9 })

      metadata = await retryProtocol(
        'LEADER_NOT_AVAILABLE',
        async () => await seedBroker.metadata([secondTopicName])
      )
      testPartitions = metadata.topicMetadata[0].partitionMetadata
        .filter(({
        leader
      }: any) => leader === partitionLeader)
        .map(({
        partitionId
      }: any) => partitionId)

      const messages = Array(30)
        // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
        .fill()
        .map(() => {
          const value = secureRandom()
          return { key: `key-${value}`, value: `value-${value}` }
        })
      producer = createProducer({
        cluster,
        // send all messages to 1 partition, which will be the only successful one
        createPartitioner: () => () => testPartitions[0],
        logger: newLogger(),
      })
      await producer.connect()
      await producer.send({ acks: 1, topic: secondTopicName, messages })

      recordsToDelete = [
        {
          topic: secondTopicName,
          partitions: [
            {
              partition: testPartitions[0],
              offset: '7',
            },
            {
              partition: testPartitions[1],
              offset: '98',
            },
            {
              partition: testPartitions[2],
              offset: '99',
            },
          ],
        },
      ]
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('rejects the promise with all partition errors', async () => {
      const brokerData = metadata.brokers.find((b: any) => b.nodeId === partitionLeader)
      broker = new Broker({
        connection: createConnection(brokerData),
        logger: newLogger(),
      })
      await broker.connect()

      let error
      try {
        await broker.deleteRecords({ topics: recordsToDelete })
      } catch (e) {
        error = e
      }

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(error).toBeDefined()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(error.name).toEqual('KafkaJSDeleteTopicRecordsError')
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(error.partitions).toEqual(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.arrayContaining([
          {
            partition: testPartitions[1],
            offset: '98',
            error: new KafkaJSProtocolError(
              'The requested offset is not within the range of offsets maintained by the server'
            ),
          },
          {
            partition: testPartitions[2],
            offset: '99',
            error: new KafkaJSProtocolError(
              'The requested offset is not within the range of offsets maintained by the server'
            ),
          },
        ])
      )
    })
  })
})
