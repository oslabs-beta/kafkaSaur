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
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitFor'.
  waitFor,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForCon... Remove this comment to see the full error message
  waitForConsumerToJoinGroup,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer', () => {
  let topicName: any, groupId: any, cluster: any, producer: any, consumer: any

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
      logger: newLogger(),
    })

    await producer.connect()
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    consumer && (await consumer.disconnect())
    producer && (await producer.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when eachMessage throws an error', () => {
    let key1: any, key3: any

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(async () => {
      await consumer.connect()
      await producer.connect()

      key1 = secureRandom()
      const message1 = { key: `key-${key1}`, value: `value-${key1}` }
      const key2 = secureRandom()
      const message2 = { key: `key-${key2}`, value: `value-${key2}` }
      key3 = secureRandom()
      const message3 = { key: `key-${key3}`, value: `value-${key3}` }

      await producer.send({ acks: 1, topic: topicName, messages: [message1, message2, message3] })
      await consumer.subscribe({ topic: topicName, fromBeginning: true })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('retries the same message', async () => {
      let succeeded = false
      const messages: any = []
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const eachMessage = jest
        .fn()
        .mockImplementationOnce(({
        message
      }: any) => {
          messages.push(message)
          throw new Error('Fail once')
        })
        .mockImplementationOnce(({
        message
      }: any) => {
          messages.push(message)
          succeeded = true
        })

      consumer.run({ eachMessage })
      await waitForConsumerToJoinGroup(consumer)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(waitFor(() => succeeded)).resolves.toBeTruthy()

      // retry the same message
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(messages.map(m => m.offset)).toEqual(['0', '0'])
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(messages.map(m => m.key.toString())).toEqual([`key-${key1}`, `key-${key1}`])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('commits the previous offsets', async () => {
      let raisedError = false
      consumer.run({
        // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
        eachMessage: async (event: any) => {
          if (event.message.key.toString() === `key-${key3}`) {
            raisedError = true
            throw new Error('some error')
          }
        },
      })

      await waitForConsumerToJoinGroup(consumer)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(waitFor(() => raisedError)).resolves.toBeTruthy()
      const coordinator = await cluster.findGroupCoordinator({ groupId })
      const offsets = await coordinator.offsetFetch({
        groupId,
        topics: [
          {
            topic: topicName,
            partitions: [{ partition: 0 }],
          },
        ],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsets).toEqual({
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        clientSideThrottleTime: expect.optional(0),
        throttleTime: 0,
        errorCode: 0,
        responses: [
          {
            partitions: [{ errorCode: 0, metadata: '', offset: '2', partition: 0 }],
            topic: topicName,
          },
        ],
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not commit the offset if autoCommit=false', async () => {
      let raisedError = false
      consumer.run({
        autoCommit: false,
        // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
        eachMessage: async (event: any) => {
          if (event.message.key.toString() === `key-${key3}`) {
            raisedError = true
            throw new Error('some error')
          }
        },
      })

      await waitForConsumerToJoinGroup(consumer)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(waitFor(() => raisedError)).resolves.toBeTruthy()
      const coordinator = await cluster.findGroupCoordinator({ groupId })
      const offsets = await coordinator.offsetFetch({
        groupId,
        topics: [
          {
            topic: topicName,
            partitions: [{ partition: 0 }],
          },
        ],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsets).toEqual({
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        clientSideThrottleTime: expect.optional(0),
        throttleTime: 0,
        errorCode: 0,
        responses: [
          {
            partitions: [{ errorCode: 0, metadata: '', offset: '-1', partition: 0 }], // the offset stays the same
            topic: topicName,
          },
        ],
      })
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when eachBatch throws an error', () => {
    let key1: any, key2: any, key3: any

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(async () => {
      await consumer.connect()
      await producer.connect()

      key1 = secureRandom()
      const message1 = { key: `key-${key1}`, value: `value-${key1}` }
      key2 = secureRandom()
      const message2 = { key: `key-${key2}`, value: `value-${key2}` }
      key3 = secureRandom()
      const message3 = { key: `key-${key3}`, value: `value-${key3}` }

      await producer.send({ acks: 1, topic: topicName, messages: [message1, message2, message3] })
      await consumer.subscribe({ topic: topicName, fromBeginning: true })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('retries the same batch', async () => {
      let succeeded = false
      const batches: any = []
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const eachBatch = jest
        .fn()
        .mockImplementationOnce(({
        batch
      }: any) => {
          batches.push(batch)
          throw new Error('Fail once')
        })
        .mockImplementationOnce(({
        batch
      }: any) => {
          batches.push(batch)
          succeeded = true
        })

      consumer.run({ eachBatch })

      await waitForConsumerToJoinGroup(consumer)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(waitFor(() => succeeded)).resolves.toBeTruthy()

      // retry the same batch
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(batches.map(b => b.messages.map((m: any) => m.offset).join(','))).toEqual(['0,1,2', '0,1,2'])
      // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'b' implicitly has an 'any' type.
      const batchMessages = batches.map(b => b.messages.map((m: any) => m.key.toString()).join('-'))
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(batchMessages).toEqual([
        `key-${key1}-key-${key2}-key-${key3}`,
        `key-${key1}-key-${key2}-key-${key3}`,
      ])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('commits the previous offsets', async () => {
      let raisedError = false
      consumer.run({
        // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
        eachBatch: async ({
          batch,
          resolveOffset
        }: any) => {
          for (const message of batch.messages) {
            if (message.key.toString() === `key-${key3}`) {
              raisedError = true
              throw new Error('some error')
            }
            resolveOffset(message.offset)
          }
        },
      })

      await waitForConsumerToJoinGroup(consumer)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(waitFor(() => raisedError)).resolves.toBeTruthy()
      const coordinator = await cluster.findGroupCoordinator({ groupId })
      const offsets = await coordinator.offsetFetch({
        groupId,
        topics: [
          {
            topic: topicName,
            partitions: [{ partition: 0 }],
          },
        ],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(offsets).toEqual({
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        clientSideThrottleTime: expect.optional(0),
        throttleTime: 0,
        errorCode: 0,
        responses: [
          {
            partitions: [{ errorCode: 0, metadata: '', offset: '2', partition: 0 }],
            topic: topicName,
          },
        ],
      })
    })
  })
})
