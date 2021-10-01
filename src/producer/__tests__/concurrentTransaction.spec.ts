import { secureRandom, newLogger, createCluster, testIfKafkaAtLeast_0_11, createTopic } from '../../../testHelpers'
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createProd... Remove this comment to see the full error message
const createProducer = require('../index')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Producer > Transactional producer', () => {
  let producer1: any, producer2: any, topicName: any, transactionalId: any, message: any

  const newProducer = () =>
    createProducer({
      cluster: createCluster(),
      logger: newLogger(),
      idempotent: true,
      transactionalId,
      transactionTimeout: 100,
    })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topicName = `test-topic-${secureRandom()}`
    transactionalId = `transactional-id-${secureRandom()}`
    message = { key: `key-${secureRandom()}`, value: `value-${secureRandom()}` }

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    producer1 && (await producer1.disconnect())
    producer2 && (await producer2.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when there is an ongoing transaction on connect', () => {
    testIfKafkaAtLeast_0_11(
      'retries initProducerId to cancel the ongoing transaction',
      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      async () => {
        // Producer 1 will create a transaction and "crash", it will never commit or abort the connection
        producer1 = newProducer()
        await producer1.connect()
        const transaction1 = await producer1.transaction()
        await transaction1.send({ topic: topicName, messages: [message] })

        // Producer 2 starts with the same transactional id to cause the concurrent transactions error
        producer2 = newProducer()
        await producer2.connect()
        let transaction2
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(producer2.transaction().then((t: any) => transaction2 = t)).resolves.toBeTruthy()
        // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
        await transaction2.send({ topic: topicName, messages: [message] })
        // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
        await transaction2.commit()
      }
    )
  })
})
