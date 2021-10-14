// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createProd... Remove this comment to see the full error message
const createProducer = require('../../producer')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createCons... Remove this comment to see the full error message
const createConsumer = require('../index')

const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
  secureRandom,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
  createCluster,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTopi... Remove this comment to see the full error message
  createTopic,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createModP... Remove this comment to see the full error message
  createModPartitioner,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sslConnect... Remove this comment to see the full error message
  sslConnectionOpts,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'saslEntrie... Remove this comment to see the full error message
  saslEntries,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sslBrokers... Remove this comment to see the full error message
  sslBrokers,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'saslBroker... Remove this comment to see the full error message
  saslBrokers,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitFor'.
  waitFor,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForCon... Remove this comment to see the full error message
  waitForConsumerToJoinGroup,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer', () => {
  let topicName: any, groupId: any, cluster: any, producer, consumer: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topicName = `test-topic-${secureRandom()}`
    groupId = `consumer-group-id-${secureRandom()}`

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName })

    cluster = createCluster()
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    consumer && (await consumer.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('support SSL connections', async () => {
    cluster = createCluster(sslConnectionOpts(), sslBrokers())
    consumer = createConsumer({
      cluster,
      groupId,
      maxWaitTimeInMs: 1,
      logger: newLogger(),
    })

    await consumer.connect()
  })

  for (const e of saslEntries) {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test(`support SASL ${e.name} connections`, async () => {
      cluster = createCluster(e.opts(), saslBrokers())

      consumer = createConsumer({
        cluster,
        groupId,
        maxWaitTimeInMs: 1,
        logger: newLogger(),
      })

      await consumer.connect()
    })
  }

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('reconnects the cluster if disconnected', async () => {
    consumer = createConsumer({
      cluster,
      groupId,
      maxWaitTimeInMs: 1,
      maxBytesPerPartition: 180,
      logger: newLogger(),
      retry: { retries: 3 },
    })

    producer = createProducer({
      cluster: createCluster(),
      createPartitioner: createModPartitioner,
      logger: newLogger(),
    })

    await consumer.connect()
    await producer.connect()
    await consumer.subscribe({ topic: topicName, fromBeginning: true })

    const messages = []
    consumer.run({
      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      eachMessage: async ({
        message
      }: any) => {
        messages.push(message)
      },
    })

    await waitForConsumerToJoinGroup(consumer)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.isConnected()).toEqual(true)
    await cluster.disconnect()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.isConnected()).toEqual(false)

    try {
      await producer.send({
        acks: 1,
        topic: topicName,
        messages: [{ key: `key-${secureRandom()}`, value: `value-${secureRandom()}` }],
      })
    } finally {
      await producer.disconnect()
    }

    await waitFor(() => cluster.isConnected())
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(waitFor(() => messages.length > 0)).resolves.toBeTruthy()
  })
})
