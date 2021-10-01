const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
  createCluster,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
  secureRandom,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTopi... Remove this comment to see the full error message
  createTopic,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createModP... Remove this comment to see the full error message
  createModPartitioner,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createProd... Remove this comment to see the full error message
const createProducer = require('../../producer')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Cluster > fetchTopicsOffset', () => {
  let cluster: any, topic: any, producer: any

  // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
  const sendSampleMessages = async () => {
    await producer.send({
      topic,
      acks: 1,
      messages: [
        { key: 'k1', value: 'v1' },
        { key: 'k2', value: 'v2' },
        { key: 'k3', value: 'v3' },
        { key: 'k4', value: 'v4' },
      ],
    })
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topic = `test-topic-${secureRandom()}`
    cluster = createCluster()

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic, partitions: 3 })
    await cluster.connect()
    await cluster.addTargetTopic(topic)

    producer = createProducer({
      cluster,
      logger: newLogger(),
      createPartitioner: createModPartitioner,
    })

    await producer.connect()
    await sendSampleMessages()
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    producer && (await producer.disconnect())
    cluster && (await cluster.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('returns latest offsets by default', async () => {
    const result = await cluster.fetchTopicsOffset([
      {
        topic,
        partitions: [{ partition: 0 }, { partition: 1 }, { partition: 2 }],
      },
    ])

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(result).toEqual([
      {
        topic,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        partitions: expect.arrayContaining([
          { partition: 0, offset: '1' },
          { partition: 1, offset: '2' },
          { partition: 2, offset: '1' },
        ]),
      },
    ])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('returns erliest if fromBeginning=true', async () => {
    const result = await cluster.fetchTopicsOffset([
      { topic, partitions: [{ partition: 0 }], fromBeginning: true },
    ])

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(result).toEqual([{ topic, partitions: [{ partition: 0, offset: '0' }] }])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('returns correct offsets if fromTimestamp', async () => {
    const fromTimestamp = Date.now()
    await sendSampleMessages()
    const resultTimestamp = await cluster.fetchTopicsOffset([
      {
        topic,
        fromTimestamp,
        partitions: [{ partition: 0 }, { partition: 1 }, { partition: 2 }],
      },
    ])

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(resultTimestamp).toEqual([
      {
        topic,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        partitions: expect.arrayContaining([
          { partition: 0, offset: '1' },
          { partition: 1, offset: '2' },
          { partition: 2, offset: '1' },
        ]),
      },
    ])

    const result = await cluster.fetchTopicsOffset([
      {
        topic,
        partitions: [{ partition: 0 }, { partition: 1 }, { partition: 2 }],
      },
    ])

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(result).toEqual([
      {
        topic,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        partitions: expect.arrayContaining([
          { partition: 0, offset: '2' },
          { partition: 1, offset: '4' },
          { partition: 2, offset: '2' },
        ]),
      },
    ])
  })
})
