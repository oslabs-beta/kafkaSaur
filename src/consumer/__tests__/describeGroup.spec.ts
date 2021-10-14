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
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForCon... Remove this comment to see the full error message
  waitForConsumerToJoinGroup,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer', () => {
  let topicName: any, groupId: any, cluster, producer: any, consumer: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topicName = `test-topic-${secureRandom()}`
    groupId = `consumer-group-id-${secureRandom()}`

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName })

    cluster = createCluster()
    producer = createProducer({
      cluster,
      createPartitioner: createModPartitioner,
      logger: newLogger(),
    })

    consumer = createConsumer({
      cluster,
      groupId,
      maxWaitTimeInMs: 1,
      maxBytesPerPartition: 180,
      logger: newLogger(),
    })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    consumer && (await consumer.disconnect())
    producer && (await producer.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('describe group', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the group description', async () => {
      await consumer.connect()
      await consumer.subscribe({ topic: topicName, fromBeginning: true })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      consumer.run({ eachMessage: jest.fn() })
      await waitForConsumerToJoinGroup(consumer)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(consumer.describeGroup()).resolves.toEqual({
        errorCode: 0,
        groupId,
        members: [
          {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            clientHost: expect.any(String),
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            clientId: expect.any(String),
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            memberId: expect.any(String),
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            memberAssignment: expect.anything(),
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            memberMetadata: expect.anything(),
          },
        ],
        protocol: 'RoundRobinAssigner',
        protocolType: 'consumer',
        state: 'Stable',
      })
    })
  })
})
