// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createAdmi... Remove this comment to see the full error message
const createAdmin = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createCons... Remove this comment to see the full error message
const createConsumer = require('../../consumer')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createProd... Remove this comment to see the full error message
const createProducer = require('../../producer')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSPro... Remove this comment to see the full error message
const { KafkaJSProtocolError } = require('../../errors')

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
  let admin: any, topicName, groupId: any, cluster, consumer: any, producer: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topicName = `test-topic-${secureRandom()}`
    groupId = `consumer-group-id-${secureRandom()}`

    cluster = createCluster()
    admin = createAdmin({ cluster: cluster, logger: newLogger() })
    consumer = createConsumer({
      cluster,
      groupId,
      maxWaitTimeInMs: 100,
      logger: newLogger(),
    })

    producer = createProducer({
      cluster,
      createPartitioner: createModPartitioner,
      logger: newLogger(),
    })

    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all([admin.connect(), consumer.connect(), producer.connect()])

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName })

    const messagesConsumed: any = []
    await consumer.subscribe({ topic: topicName, fromBeginning: true })
    consumer.run({ eachMessage: async (event: any) => messagesConsumed.push(event) })
    await waitForConsumerToJoinGroup(consumer)

    const messages = Array(1)
      // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
      .fill()
      .map(() => {
        const value = secureRandom()
        return { key: `key-${value}`, value: `value-${value}` }
      })

    await producer.send({ acks: 1, topic: topicName, messages })
    await waitForMessages(messagesConsumed, { number: messages.length })

    const listGroupResponse = await admin.listGroups()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(listGroupResponse.groups).toEqual(
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect.arrayContaining([expect.objectContaining({ groupId })])
    )
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    // Checking that they exist first, in case the test is skipped or failed before instantiating the admin/consumer
    admin && (await admin.disconnect())
    consumer && (await consumer.disconnect())
    producer && (await producer.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('deleteGroups', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('delete empty groups', async () => {
      // let's check deleting empty group
      const resEmpty = await admin.deleteGroups([])

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(resEmpty).toEqual([])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('delete groups that is still connected', async () => {
      // let's try to delete group that has consumer connected, it should throw error
      try {
        await admin.deleteGroups([groupId])
      } catch (error) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(error.name).toEqual('KafkaJSDeleteGroupsError')
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(error.groups).toEqual(expect.arrayContaining([expect.objectContaining({ groupId })]))
        for (const group of error.groups) {
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(group.error).toBeInstanceOf(KafkaJSProtocolError)
        }
      }
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('delete groups', async () => {
      // now let's try to stop consumer and then delete group
      await consumer.stop()

      const res = await admin.deleteGroups([groupId])
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(res).toEqual(expect.arrayContaining([expect.objectContaining({ groupId })]))

      const listGroupResponseAfter = await admin.listGroups()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(listGroupResponseAfter.groups).toEqual(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.not.arrayContaining([expect.objectContaining({ groupId })])
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('delete one group that does not exist and one that exists', async () => {
      // let's disconnect from consumer
      await consumer.stop()

      // let's try to delete group that exits and one that doesn't, it should throw error but delete the one that does
      const nonExistingGroupId = `consumer-group-id-${secureRandom()}`
      try {
        await admin.deleteGroups([groupId, nonExistingGroupId])
      } catch (error) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(error.name).toEqual('KafkaJSDeleteGroupsError')
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(error.groups).toEqual(
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect.arrayContaining([expect.objectContaining({ groupId: nonExistingGroupId })])
        )
        for (const group of error.groups) {
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(group.error).toBeInstanceOf(KafkaJSProtocolError)
        }
      }

      const listGroupResponseAfter = await admin.listGroups()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(listGroupResponseAfter.groups).toEqual(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.not.arrayContaining([expect.objectContaining({ groupId })])
      )
    })
  })
})
