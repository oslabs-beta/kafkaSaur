// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Broker'.
const Broker = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'COORDINATO... Remove this comment to see the full error message
const COORDINATOR_TYPES = require('../../protocol/coordinatorTypes')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Compressio... Remove this comment to see the full error message
const { Types: Compression } = require('../../protocol/message/compression')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSPro... Remove this comment to see the full error message
const { KafkaJSProtocolError } = require('../../errors')
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
  secureRandom,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createConn... Remove this comment to see the full error message
  createConnection,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTopi... Remove this comment to see the full error message
  createTopic,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'testIfKafk... Remove this comment to see the full error message
  testIfKafkaAtLeast_0_11,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'retryProto... Remove this comment to see the full error message
  retryProtocol,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Broker > Produce', () => {
  let topicName: any, broker: any, broker2: any
  const timestamp = 1509928155660

  const createHeader = () => ({
    headers: { [`hkey-${secureRandom()}`]: `hvalue-${secureRandom()}` },
  })

  const createTopicData = ({ headers = false, firstSequence = 0 } = {}) => [
    {
      topic: topicName,
      partitions: [
        {
          partition: 0,
          firstSequence,
          messages: [
            {
              key: `key-${secureRandom()}`,
              value: `some-value-${secureRandom()}`,
              timestamp,
              ...(headers ? createHeader() : {}),
            },
            {
              key: `key-${secureRandom()}`,
              value: `some-value-${secureRandom()}`,
              timestamp,
              ...(headers ? createHeader() : {}),
            },
            {
              key: `key-${secureRandom()}`,
              value: `some-value-${secureRandom()}`,
              timestamp,
              ...(headers ? createHeader() : {}),
            },
          ],
        },
      ],
    },
  ]

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topicName = `test-topic-${secureRandom()}`
    broker = new Broker({
      connection: createConnection(),
      logger: newLogger(),
    })
    await broker.connect()
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    broker && (await broker.disconnect())
    broker2 && (await broker2.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('rejects the Promise if lookupRequest is not defined', async () => {
    await broker.disconnect()
    broker = new Broker({
      connection: createConnection(),
      logger: newLogger(),
    })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(broker.produce({ topicData: [] })).rejects.toEqual(
      new Error('Broker not connected')
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const metadata = await retryProtocol(
      'LEADER_NOT_AVAILABLE',
      async () => await broker.metadata([topicName])
    )

    // Find leader of partition
    const partitionBroker = metadata.topicMetadata[0].partitionMetadata[0].leader
    const newBrokerData = metadata.brokers.find((b: any) => b.nodeId === partitionBroker)

    // Connect to the correct broker to produce message
    broker2 = new Broker({
      connection: createConnection(newBrokerData),
      logger: newLogger(),
    })
    await broker2.connect()

    const response1 = await retryProtocol(
      'LEADER_NOT_AVAILABLE',
      async () => await broker2.produce({ topicData: createTopicData() })
    )
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response1).toEqual({
      topics: [
        {
          topicName,
          partitions: [
            {
              errorCode: 0,
              baseOffset: '0',
              partition: 0,
              logAppendTime: '-1',
              logStartOffset: '0',
            },
          ],
        },
      ],
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
    })

    const response2 = await broker2.produce({ topicData: createTopicData() })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response2).toEqual({
      topics: [
        {
          topicName,
          partitions: [
            {
              errorCode: 0,
              baseOffset: '3',
              partition: 0,
              logAppendTime: '-1',
              logStartOffset: '0',
            },
          ],
        },
      ],
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request with GZIP', async () => {
    const metadata = await retryProtocol(
      'LEADER_NOT_AVAILABLE',
      async () => await broker.metadata([topicName])
    )

    // Find leader of partition
    const partitionBroker = metadata.topicMetadata[0].partitionMetadata[0].leader
    const newBrokerData = metadata.brokers.find((b: any) => b.nodeId === partitionBroker)

    // Connect to the correct broker to produce message
    broker2 = new Broker({
      connection: createConnection(newBrokerData),
      logger: newLogger(),
    })
    await broker2.connect()

    const response1 = await retryProtocol(
      'LEADER_NOT_AVAILABLE',
      async () =>
        await broker2.produce({
          compression: Compression.GZIP,
          topicData: createTopicData(),
        })
    )

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response1).toEqual({
      topics: [
        {
          topicName,
          partitions: [
            {
              errorCode: 0,
              baseOffset: '0',
              partition: 0,
              logAppendTime: '-1',
              logStartOffset: '0',
            },
          ],
        },
      ],
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
    })

    const response2 = await broker2.produce({
      compression: Compression.GZIP,
      topicData: createTopicData(),
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response2).toEqual({
      topics: [
        {
          topicName,
          partitions: [
            {
              errorCode: 0,
              baseOffset: '3',
              partition: 0,
              logAppendTime: '-1',
              logStartOffset: '0',
            },
          ],
        },
      ],
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Record batch', () => {
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    testIfKafkaAtLeast_0_11('request', async () => {
      const metadata = await retryProtocol(
        'LEADER_NOT_AVAILABLE',
        async () => await broker.metadata([topicName])
      )

      // Find leader of partition
      const partitionBroker = metadata.topicMetadata[0].partitionMetadata[0].leader
      const newBrokerData = metadata.brokers.find((b: any) => b.nodeId === partitionBroker)

      // Connect to the correct broker to produce message
      broker2 = new Broker({
        connection: createConnection(newBrokerData),
        logger: newLogger(),
      })
      await broker2.connect()

      const response1 = await retryProtocol(
        'LEADER_NOT_AVAILABLE',
        async () => await broker2.produce({ topicData: createTopicData() })
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(response1).toEqual({
        topics: [
          {
            topicName,
            partitions: [
              {
                baseOffset: '0',
                errorCode: 0,
                logAppendTime: '-1',
                logStartOffset: '0',
                partition: 0,
              },
            ],
          },
        ],
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        clientSideThrottleTime: expect.optional(0),
        throttleTime: 0,
      })

      const response2 = await broker2.produce({ topicData: createTopicData() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(response2).toEqual({
        topics: [
          {
            topicName,
            partitions: [
              {
                baseOffset: '3',
                errorCode: 0,
                logAppendTime: '-1',
                logStartOffset: '0',
                partition: 0,
              },
            ],
          },
        ],
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        clientSideThrottleTime: expect.optional(0),
        throttleTime: 0,
      })
    })

    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    testIfKafkaAtLeast_0_11('request with idempotent producer', async () => {
      // Get producer id & epoch
      const {
        coordinator: { host, port },
      } = await retryProtocol(
        'GROUP_COORDINATOR_NOT_AVAILABLE',
        async () =>
          await broker.findGroupCoordinator({
            groupId: `group-${secureRandom()}`,
            coordinatorType: COORDINATOR_TYPES.GROUP,
          })
      )

      const producerBroker = new Broker({
        connection: createConnection({ host, port }),
        logger: newLogger(),
      })

      await producerBroker.connect()
      const result = await producerBroker.initProducerId({
        transactionTimeout: 30000,
      })

      const producerId = result.producerId
      const producerEpoch = result.producerEpoch

      const metadata = await retryProtocol(
        'LEADER_NOT_AVAILABLE',
        async () => await broker.metadata([topicName])
      )

      // Find leader of partition
      const partitionBroker = metadata.topicMetadata[0].partitionMetadata[0].leader
      const newBrokerData = metadata.brokers.find((b: any) => b.nodeId === partitionBroker)

      // Connect to the correct broker to produce message
      broker2 = new Broker({
        connection: createConnection(newBrokerData),
        logger: newLogger(),
      })
      await broker2.connect()

      const response1 = await retryProtocol(
        'LEADER_NOT_AVAILABLE',
        async () =>
          await broker2.produce({
            producerId,
            producerEpoch,
            topicData: createTopicData({ headers: false }),
          })
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(response1).toEqual({
        topics: [
          {
            topicName,
            partitions: [
              {
                baseOffset: '0',
                errorCode: 0,
                logAppendTime: '-1',
                logStartOffset: '0',
                partition: 0,
              },
            ],
          },
        ],
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        clientSideThrottleTime: expect.optional(0),
        throttleTime: 0,
      })

      // We have to syncronise the sequence number between the producer and the broker
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        broker2.produce({
          producerId,
          producerEpoch,
          topicData: createTopicData({ headers: false, firstSequence: 1 }), // Too small
        })
      ).rejects.toEqual(
        new KafkaJSProtocolError('The broker received an out of order sequence number')
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        broker2.produce({
          producerId,
          producerEpoch,
          topicData: createTopicData({ headers: false, firstSequence: 5 }), // Too big
        })
      ).rejects.toEqual(
        new KafkaJSProtocolError('The broker received an out of order sequence number')
      )

      await broker2.produce({
        producerId,
        producerEpoch,
        topicData: createTopicData({ headers: false, firstSequence: 3 }), // Just right
      })
    })

    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    testIfKafkaAtLeast_0_11('request with headers', async () => {
      const metadata = await retryProtocol(
        'LEADER_NOT_AVAILABLE',
        async () => await broker.metadata([topicName])
      )

      // Find leader of partition
      const partitionBroker = metadata.topicMetadata[0].partitionMetadata[0].leader
      const newBrokerData = metadata.brokers.find((b: any) => b.nodeId === partitionBroker)

      // Connect to the correct broker to produce message
      broker2 = new Broker({
        connection: createConnection(newBrokerData),
        logger: newLogger(),
      })
      await broker2.connect()

      const response1 = await retryProtocol(
        'LEADER_NOT_AVAILABLE',
        async () => await broker2.produce({ topicData: createTopicData({ headers: true }) })
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(response1).toEqual({
        topics: [
          {
            topicName,
            partitions: [
              {
                baseOffset: '0',
                errorCode: 0,
                logAppendTime: '-1',
                logStartOffset: '0',
                partition: 0,
              },
            ],
          },
        ],
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        clientSideThrottleTime: expect.optional(0),
        throttleTime: 0,
      })

      const response2 = await broker2.produce({ topicData: createTopicData() })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(response2).toEqual({
        topics: [
          {
            topicName,
            partitions: [
              {
                baseOffset: '3',
                errorCode: 0,
                logAppendTime: '-1',
                logStartOffset: '0',
                partition: 0,
              },
            ],
          },
        ],
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        clientSideThrottleTime: expect.optional(0),
        throttleTime: 0,
      })
    })

    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    testIfKafkaAtLeast_0_11('request with GZIP', async () => {
      const metadata = await retryProtocol(
        'LEADER_NOT_AVAILABLE',
        async () => await broker.metadata([topicName])
      )

      // Find leader of partition
      const partitionBroker = metadata.topicMetadata[0].partitionMetadata[0].leader
      const newBrokerData = metadata.brokers.find((b: any) => b.nodeId === partitionBroker)

      // Connect to the correct broker to produce message
      broker2 = new Broker({
        connection: createConnection(newBrokerData),
        logger: newLogger(),
      })
      await broker2.connect()

      const response1 = await retryProtocol(
        'LEADER_NOT_AVAILABLE',
        async () =>
          await broker2.produce({
            compression: Compression.GZIP,
            topicData: createTopicData(),
          })
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(response1).toEqual({
        topics: [
          {
            topicName,
            partitions: [
              {
                baseOffset: '0',
                errorCode: 0,
                logAppendTime: '-1',
                logStartOffset: '0',
                partition: 0,
              },
            ],
          },
        ],
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        clientSideThrottleTime: expect.optional(0),
        throttleTime: 0,
      })

      const response2 = await broker2.produce({
        compression: Compression.GZIP,
        topicData: createTopicData(),
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(response2).toEqual({
        topics: [
          {
            topicName,
            partitions: [
              {
                baseOffset: '3',
                errorCode: 0,
                logAppendTime: '-1',
                logStartOffset: '0',
                partition: 0,
              },
            ],
          },
        ],
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        clientSideThrottleTime: expect.optional(0),
        throttleTime: 0,
      })
    })

    testIfKafkaAtLeast_0_11(
      'request to a topic with max timestamp difference configured',
      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      async () => {
        topicName = `test-max-timestamp-difference-${secureRandom()}`

        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        await createTopic({
          topic: topicName,
          config: [
            {
              name: 'message.timestamp.difference.max.ms',
              value: '604800000', // 7 days
            },
          ],
        })

        const metadata = await retryProtocol(
          'LEADER_NOT_AVAILABLE',
          async () => await broker.metadata([topicName])
        )

        // Find leader of partition
        const partitionBroker = metadata.topicMetadata[0].partitionMetadata[0].leader
        const newBrokerData = metadata.brokers.find((b: any) => b.nodeId === partitionBroker)

        // Connect to the correct broker to produce message
        broker2 = new Broker({
          connection: createConnection(newBrokerData),
          logger: newLogger(),
        })
        await broker2.connect()

        const partitionData = {
          topic: topicName,
          partitions: [
            {
              partition: 0,
              messages: [{ key: `key-${secureRandom()}`, value: `some-value-${secureRandom()}` }],
            },
          ],
        }

        const response1 = await retryProtocol(
          'LEADER_NOT_AVAILABLE',
          async () => await broker2.produce({ topicData: [partitionData] })
        )

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(response1).toEqual({
          topics: [
            {
              topicName,
              partitions: [
                {
                  baseOffset: '0',
                  errorCode: 0,
                  logAppendTime: '-1',
                  logStartOffset: '0',
                  partition: 0,
                },
              ],
            },
          ],
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          clientSideThrottleTime: expect.optional(0),
          throttleTime: 0,
        })
      }
    )
  })
})
