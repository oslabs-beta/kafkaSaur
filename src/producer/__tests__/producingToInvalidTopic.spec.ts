// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
const { secureRandom, newLogger, createCluster, createTopic } = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createProd... Remove this comment to see the full error message
const createProducer = require('../index')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Producer > Producing to invalid topics', () => {
  let producer: any, topicName: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topicName = `test-topic-${secureRandom()}`

    producer = createProducer({
      cluster: createCluster(),
      logger: newLogger(),
    })
    await producer.connect()
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    producer && (await producer.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('it rejects when producing to an invalid topic name, but is able to subsequently produce to a valid topic', async () => {
    producer = createProducer({
      cluster: createCluster(),
      logger: newLogger(),
    })
    await producer.connect()

    const message = { key: `key-${secureRandom()}`, value: `value-${secureRandom()}` }
    const invalidTopicName = `${topicName}-abc)(*&^%`
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(producer.send({ topic: invalidTopicName, messages: [message] })).rejects.toThrow(
      'The request attempted to perform an operation on an invalid topic'
    )

    await producer.send({ topic: topicName, messages: [message] })
  })
})
