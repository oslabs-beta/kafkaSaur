// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Broker'.
const Broker = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKeys'.
const apiKeys = require('../../protocol/requests/apiKeys')
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
  secureRandom,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createConn... Remove this comment to see the full error message
  createConnection,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTopi... Remove this comment to see the full error message
  createTopic,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'retryProto... Remove this comment to see the full error message
  retryProtocol,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

const EARLIEST = -2
const LATEST = -1

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Broker > ListOffsets', () => {
  let topicName: any, seedBroker: any, broker: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topicName = `test-topic-${secureRandom()}`
    seedBroker = new Broker({
      connection: createConnection(),
      logger: newLogger(),
    })
    await seedBroker.connect()
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName })

    const metadata = await retryProtocol(
      'LEADER_NOT_AVAILABLE',
      async () => await seedBroker.metadata([topicName])
    )

    // Find leader of partition
    const partitionBroker = metadata.topicMetadata[0].partitionMetadata[0].leader
    const newBrokerData = metadata.brokers.find((b: any) => b.nodeId === partitionBroker)

    // Connect to the correct broker to produce message
    broker = new Broker({
      connection: createConnection(newBrokerData),
      logger: newLogger(),
    })
    await broker.connect()
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    seedBroker && (await seedBroker.disconnect())
    broker && (await broker.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const produceData = [
      {
        topic: topicName,
        partitions: [
          {
            partition: 0,
            messages: [{ key: `key-0`, value: `some-value-0` }],
          },
        ],
      },
    ]

    await broker.produce({ topicData: produceData })

    const topics = [
      {
        topic: topicName,
        partitions: [{ partition: 0 }],
      },
    ]

    const response = await broker.listOffsets({ topics })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response).toEqual({
      responses: [
        {
          topic: topicName,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          partitions: expect.arrayContaining([
            {
              errorCode: 0,
              // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
              offset: expect.stringMatching(/\d+/),
              partition: 0,
              timestamp: '-1',
            },
          ]),
        },
      ],
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request different points of interest', async () => {
    const produceData = () => [
      {
        topic: topicName,
        partitions: [
          {
            partition: 0,
            messages: [
              { key: `key-${secureRandom()}`, value: `some-value-${secureRandom()}` },
              { key: `key-${secureRandom()}`, value: `some-value-${secureRandom()}` },
            ],
          },
        ],
      },
    ]

    await broker.produce({ topicData: produceData() })
    await broker.produce({ topicData: produceData() })

    let topics = [
      {
        topic: topicName,
        partitions: [{ partition: 0, timestamp: LATEST }],
      },
    ]

    let response = await broker.listOffsets({ topics })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response).toEqual({
      responses: [
        {
          topic: topicName,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          partitions: expect.arrayContaining([
            {
              errorCode: 0,
              offset: '4',
              partition: 0,
              timestamp: '-1',
            },
          ]),
        },
      ],
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
    })

    topics = [
      {
        topic: topicName,
        partitions: [{ partition: 0, timestamp: EARLIEST }],
      },
    ]

    response = await broker.listOffsets({ topics })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response).toEqual({
      responses: [
        {
          topic: topicName,
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          partitions: expect.arrayContaining([
            {
              errorCode: 0,
              offset: '0',
              partition: 0,
              timestamp: '-1',
            },
          ]),
        },
      ],
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('v0', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('request', async () => {
      broker.versions[apiKeys.ListOffsets].minVersion = 0
      broker.versions[apiKeys.ListOffsets].maxVersion = 0

      const produceData = [
        {
          topic: topicName,
          partitions: [
            {
              partition: 0,
              messages: [{ key: `key-0`, value: `some-value-0` }],
            },
          ],
        },
      ]

      await broker.produce({ topicData: produceData })

      const topics = [
        {
          topic: topicName,
          partitions: [{ partition: 0 }],
        },
      ]

      const response = await broker.listOffsets({ topics })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(response).toEqual({
        responses: [
          {
            topic: topicName,
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            partitions: expect.arrayContaining([
              {
                errorCode: 0,
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
                offset: expect.stringMatching(/\d+/),
                partition: 0,
              },
            ]),
          },
        ],
      })
    })
  })
})
