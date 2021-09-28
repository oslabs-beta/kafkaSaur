// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createCons... Remove this comment to see the full error message
const createConsumer = require('../index')

const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
  secureRandom,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
  createCluster,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTopi... Remove this comment to see the full error message
  createTopic,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForCon... Remove this comment to see the full error message
  waitForConsumerToJoinGroup,
  flakyTest,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer', () => {
  let topicNames: any, groupId: any, consumer1: any, consumer2: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topicNames = [`test-topic-${secureRandom()}`, `test-topic-${secureRandom()}`]
    groupId = `consumer-group-id-${secureRandom()}`

    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all(topicNames.map(topicName => createTopic({ topic: topicName, partitions: 2 })))

    consumer1 = createConsumer({
      cluster: createCluster({ metadataMaxAge: 50 }),
      groupId,
      heartbeatInterval: 100,
      maxWaitTimeInMs: 100,
      rebalanceTimeout: 1000,
      logger: newLogger(),
    })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    consumer1 && (await consumer1.disconnect())
    consumer2 && (await consumer2.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('handles receiving assignments for unsubscribed topics', async () => {
    await consumer1.connect()
    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all(
      topicNames.map((topicName: any) => consumer1.subscribe({ topic: topicName, fromBeginning: true }))
    )

    consumer1.run({ eachMessage: () => {} })
    await waitForConsumerToJoinGroup(consumer1, { label: 'consumer1' })

    // Second consumer re-uses group id but only subscribes to one of the topics
    consumer2 = createConsumer({
      cluster: createCluster({ metadataMaxAge: 50 }),
      groupId,
      heartbeatInterval: 100,
      maxWaitTimeInMs: 1000,
      rebalanceTimeout: 1000,
      logger: newLogger(),
    })

    await consumer2.connect()
    await consumer2.subscribe({ topic: topicNames[0], fromBeginning: true })

    consumer2.run({ eachMessage: () => {} })
    const event = await waitForConsumerToJoinGroup(consumer2, { label: 'consumer2' })

    // verify that the assigment does not contain the unsubscribed topic
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(event.payload.memberAssignment[topicNames[1]]).toBeUndefined()
  })

  // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
  flakyTest('starts consuming from new topics after already having assignments', async () => {
    consumer2 = createConsumer({
      cluster: createCluster({ metadataMaxAge: 50 }),
      groupId,
      heartbeatInterval: 100,
      maxWaitTimeInMs: 100,
      rebalanceTimeout: 1000,
      logger: newLogger(),
    })

    // Both consumers receive assignments for one topic
    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    let assignments = await Promise.all(
      [consumer1, consumer2].map(async consumer => {
        await consumer.connect()
        await consumer.subscribe({ topic: topicNames[0] })
        consumer.run({ eachMessage: () => {} })
        return waitForConsumerToJoinGroup(consumer)
      })
    )

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    assignments.forEach((assignment: any) => expect(Object.keys(assignment.payload.memberAssignment)).toEqual([topicNames[0]])
    )

    // One consumer is replaced with a new one, subscribing to the old topic as well as a new one
    await consumer1.disconnect()
    consumer1 = createConsumer({
      cluster: createCluster({ metadataMaxAge: 50 }),
      groupId,
      heartbeatInterval: 100,
      maxWaitTimeInMs: 100,
      rebalanceTimeout: 1000,
      logger: newLogger(),
    })

    await consumer1.connect()
    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all(topicNames.map((topic: any) => consumer1.subscribe({ topic })))
    consumer1.run({ eachMessage: () => {} })
    await waitForConsumerToJoinGroup(consumer1)

    // Second consumer is also replaced, subscribing to both topics
    await consumer2.disconnect()
    consumer2 = createConsumer({
      cluster: createCluster({ metadataMaxAge: 50 }),
      groupId,
      heartbeatInterval: 100,
      maxWaitTimeInMs: 100,
      rebalanceTimeout: 1000,
      logger: newLogger(),
    })

    await consumer2.connect()
    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all(topicNames.map((topic: any) => consumer2.subscribe({ topic })))
    consumer2.run({ eachMessage: () => {} })

    // Both consumers are assigned to both topics
    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    assignments = await Promise.all(
      [consumer1, consumer2].map(consumer => waitForConsumerToJoinGroup(consumer))
    )

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    assignments.forEach((assignment: any) => expect(Object.keys(assignment.payload.memberAssignment)).toEqual(topicNames)
    )
  })
})
