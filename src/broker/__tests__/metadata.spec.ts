// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Broker'.
const Broker = require('../index')
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
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'testIfKafk... Remove this comment to see the full error message
  testIfKafkaAtLeast_0_11,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Broker > Metadata', () => {
  let topicName: any, broker: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    topicName = `test-topic-${secureRandom()}`
    broker = new Broker({
      connection: createConnection(),
      logger: newLogger(),
    })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    broker && (await broker.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('rejects the Promise if lookupRequest is not defined', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(broker.metadata()).rejects.toEqual(new Error('Broker not connected'))
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    await broker.connect()
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName })

    const response = await retryProtocol(
      'LEADER_NOT_AVAILABLE',
      async () => await broker.metadata([topicName])
    )

    // We can run this test on both clusters with a broker.rack configuration and brokers
    // without, but that is painful to describe in jest. Work out the values for the rack
    // setting separately.
    const rackValues = response.brokers.some(({
      rack
    }: any) => Boolean(rack))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response).toMatchObject({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      brokers: expect.arrayContaining([
        {
          host: 'localhost',
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          nodeId: expect.any(Number),
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          port: expect.any(Number),
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          rack: rackValues ? expect.any(String) : null,
        },
      ]),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clusterId: expect.stringMatching(/[a-zA-Z0-9-]/),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      controllerId: expect.any(Number),
      topicMetadata: [
        {
          isInternal: false,
          partitionMetadata: [
            {
              // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
              isr: expect.any(Array),
              // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
              leader: expect.any(Number),
              partitionErrorCode: 0,
              partitionId: 0,
              // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
              replicas: expect.any(Array),
            },
          ],
          topic: topicName,
          topicErrorCode: 0,
        },
      ],
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('can fetch metatada for all topics', async () => {
    await broker.connect()
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName })
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: `test-topic-${secureRandom()}` })

    let response = await retryProtocol(
      'LEADER_NOT_AVAILABLE',
      async () => await broker.metadata([])
    )

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response.topicMetadata.length).toBeGreaterThanOrEqual(2)

    response = await retryProtocol(
      'LEADER_NOT_AVAILABLE',
      async () => await broker.metadata([topicName])
    )

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response.topicMetadata.length).toEqual(1)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when allowAutoTopicCreation is disabled and the topic does not exist', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      topicName = `test-topic-${secureRandom()}`
      broker = new Broker({
        connection: createConnection(),
        allowAutoTopicCreation: false,
        logger: newLogger(),
      })
    })

    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    testIfKafkaAtLeast_0_11('returns UNKNOWN_TOPIC_OR_PARTITION', async () => {
      await broker.connect()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(broker.metadata([topicName])).rejects.toHaveProperty(
        'type',
        'UNKNOWN_TOPIC_OR_PARTITION'
      )
    })
  })
})
