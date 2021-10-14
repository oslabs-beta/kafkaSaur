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
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createCons... Remove this comment to see the full error message
const createConsumer = require('../index')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer', () => {
  let topicName: any, groupId, consumer: any

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#run', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(async () => {
      topicName = `test-topic-${secureRandom()}`
      groupId = `consumer-group-id-${secureRandom()}`

      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      await createTopic({ topic: topicName })
      consumer = createConsumer({
        cluster: createCluster({ metadataMaxAge: 50 }),
        groupId,
        heartbeatInterval: 100,
        maxWaitTimeInMs: 100,
        logger: newLogger(),
      })
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
    afterEach(async () => {
      consumer && (await consumer.disconnect())
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the consumer is already running', () => {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('ignores the call', async () => {
        await consumer.connect()
        await consumer.subscribe({ topic: topicName, fromBeginning: true })
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        const eachMessage = jest.fn()

        // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
        Promise.all([
          consumer.run({ eachMessage }),
          consumer.run({ eachMessage }),
          consumer.run({ eachMessage }),
        ])

        // Since the consumer gets overridden, it will fail to join the group
        // as three other consumers will also try to join. This case is hard to write a test
        // since we can only assert the symptoms of the problem, but we can't assert that
        // we don't initialize the consumer.
        await waitForConsumerToJoinGroup(consumer)
      })
    })
  })
})
