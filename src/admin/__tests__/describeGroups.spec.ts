// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createAdmi... Remove this comment to see the full error message
const createAdmin = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createCons... Remove this comment to see the full error message
const createConsumer = require('../../consumer')
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
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForCon... Remove this comment to see the full error message
  waitForConsumerToJoinGroup,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForMes... Remove this comment to see the full error message
  waitForMessages,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Admin', () => {
  let admin: any, topicName: any, groupIds: any, consumers: any, producer: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeAll'.
  beforeAll(async () => {
    topicName = `test-topic-${secureRandom()}`
    groupIds = [
      `consumer-group-id-${secureRandom()}`,
      `consumer-group-id-${secureRandom()}`,
      `consumer-group-id-${secureRandom()}`,
    ]

    admin = createAdmin({
      cluster: createCluster({ metadataMaxAge: 50 }),
      logger: newLogger(),
    })

    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'groupId' implicitly has an 'any' type.
    consumers = groupIds.map(groupId =>
      createConsumer({
        cluster: createCluster({ metadataMaxAge: 50 }),
        groupId,
        heartbeatInterval: 100,
        maxWaitTimeInMs: 500,
        maxBytesPerPartition: 180,
        rebalanceTimeout: 1000,
        logger: newLogger(),
      })
    )

    producer = createProducer({
      cluster: createCluster({ metadataMaxAge: 50 }),
      createPartitioner: createModPartitioner,
      logger: newLogger(),
    })

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName })

    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all([
      admin.connect(),
      producer.connect(),
      // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'consumer' implicitly has an 'any' type.
      ...consumers.map(consumer => consumer.connect()),
    ])

    const messagesConsumed: any = []
    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all(
      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      consumers.map(async consumer => {
        await consumer.subscribe({ topic: topicName, fromBeginning: true })
        consumer.run({ eachMessage: async (event: any) => messagesConsumed.push(event) })
        await waitForConsumerToJoinGroup(consumer)
      })
    )

    const messages = Array(1)
      // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
      .fill()
      .map(() => {
        const value = secureRandom()
        return { key: `key-${value}`, value: `value-${value}` }
      })

    await producer.send({ acks: 1, topic: topicName, messages })
    await waitForMessages(messagesConsumed, { number: messages.length * consumers.length })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterAll'.
  afterAll(async () => {
    admin && (await admin.disconnect())
    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    consumers && (await Promise.all(consumers.map((consumer: any) => consumer.disconnect())))
    producer && (await producer.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('describeGroups', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('returns describe group response for multiple groups', async () => {
      const describeGroupsResponse = await admin.describeGroups(groupIds)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(describeGroupsResponse.groups).toIncludeSameMembers(
        groupIds.map((groupId: any) => ({
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
          state: 'Stable'
        }))
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('returns a response for groups that do not exist', async () => {
      const groupId = `non-existent-consumer-group-id-${secureRandom()}`
      const response = await admin.describeGroups([groupId])

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(response).toEqual({
        groups: [
          {
            errorCode: 0,
            groupId,
            members: [],
            protocol: '',
            protocolType: '',
            state: 'Dead',
          },
        ],
      })
    })
  })
})
