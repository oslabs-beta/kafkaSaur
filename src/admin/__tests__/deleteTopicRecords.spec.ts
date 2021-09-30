
import createAdmin from '../index'
import createProducer from '../../producer'
import createConsumer from '../../consumer'

import {
  createCluster,
  newLogger,
  createTopic,
  secureRandom,
  createModPartitioner,
  waitForMessages
} from 'testHelpers'


import Broker from '../../broker'
import {
  KafkaJSProtocolError,
  KafkaJSOffsetOutOfRange,
  KafkaJSDeleteTopicRecordsError,
  KafkaJSBrokerNotFound,
  KafkaJSNonRetriableError,
  KafkaJSMetadataNotLoaded
} from '../../errors'

import { createErrorFromCode, errorCodes } from '../../protocol/error'

const { assign } = Object

const STALE_METADATA_ERRORS = [
  createErrorFromCode(errorCodes.find(({
    type
  }: any) => type === 'UNKNOWN_TOPIC_OR_PARTITION').code),
  createErrorFromCode(errorCodes.find(({
    type
  }: any) => type === 'LEADER_NOT_AVAILABLE').code),
  createErrorFromCode(errorCodes.find(({
    type
  }: any) => type === 'NOT_LEADER_FOR_PARTITION').code),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
  new KafkaJSMetadataNotLoaded('test'),
]

const logger = assign(newLogger(), { namespace: () => logger })
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.spyOn(logger, 'warn')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Admin > deleteTopicRecords', () => {
  let topicName: any, cluster: any, admin: any, producer: any, consumer: any, groupId, brokerSpy: any, metadataSpy: any

  // used to test expected values that could be 1 of 2 possibilities
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect.extend({
    toBeEither(received: any, first: any, second: any) {
      const message = () => `expected ${received} to be either ${first} or ${second}`
      const pass = received === first || received === second
      if (pass) {
        return { message, pass: true }
      } else {
        return { message, pass: false }
      }
    },
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topicName = `test-topic-${secureRandom()}`

    cluster = createCluster()
    admin = createAdmin({ cluster: cluster, logger })

    producer = createProducer({
      cluster,
      createPartitioner: createModPartitioner,
      logger,
    })

    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all([admin.connect(), producer.connect()])

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName, partitions: 2 })

    const messages = Array(20)
      // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
      .fill()
      .map((e: any, i: any) => {
        const value = secureRandom()
        return { key: `key-${i}`, value: `value-${value}` }
      })

    await producer.send({ acks: 1, topic: topicName, messages })

    groupId = `consumer-group-id-${secureRandom()}`
    consumer = createConsumer({
      cluster,
      groupId,
      maxWaitTimeInMs: 100,
      logger,
    })
    await consumer.subscribe({ topic: topicName, fromBeginning: true })

    // validate the modulus partitioner allocates 20 messages 13:7
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(
      await cluster.fetchTopicsOffset([
        {
          topic: topicName,
          partitions: [{ partition: 0 }, { partition: 1 }],
          fromBeginning: false,
        },
      ])
    ).toEqual([
      {
        topic: topicName,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        partitions: expect.arrayContaining([
          { partition: 0, offset: '13' },
          { partition: 1, offset: '7' },
        ]),
      },
    ])

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    brokerSpy = jest.spyOn(Broker.prototype, 'deleteRecords')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    metadataSpy = jest.spyOn(cluster, 'refreshMetadata')
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    producer && (await producer.disconnect())
    admin && (await admin.disconnect())
    consumer && (await consumer.disconnect())
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.resetAllMocks()
    brokerSpy && brokerSpy.mockRestore()
    metadataSpy && metadataSpy.mockRestore()
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterAll'.
  afterAll(jest.restoreAllMocks)

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('throws an error if the topic name is invalid', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(admin.deleteTopicRecords({ topic: null })).rejects.toHaveProperty(
      'message',
      'Invalid topic "null"'
    )

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(admin.deleteTopicRecords({ topic: ['topic-in-an-array'] })).rejects.toHaveProperty(
      'message',
      'Invalid topic "topic-in-an-array"'
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('throws an error if the partitions array is invalid', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(
      admin.deleteTopicRecords({ topic: topicName, partitions: [] })
    ).rejects.toHaveProperty('message', 'Invalid partitions')
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('removes deleted offsets from the selected partition', async () => {
    const recordsToDelete = [{ partition: 0, offset: '7' }]
    await admin.deleteTopicRecords({ topic: topicName, partitions: recordsToDelete })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(
      await cluster.fetchTopicsOffset([
        {
          topic: topicName,
          partitions: [{ partition: 0 }, { partition: 1 }],
          fromBeginning: true,
        },
      ])
    ).toEqual([
      {
        topic: topicName,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        partitions: expect.arrayContaining([
          { partition: 0, offset: '7' },
          { partition: 1, offset: '0' },
        ]),
      },
    ])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('non-deleted messages are successfully consumed', async () => {
    const recordsToDelete = [{ partition: 0, offset: '7' }]
    const messagesConsumed: any = []
    await admin.deleteTopicRecords({ topic: topicName, partitions: recordsToDelete })
    consumer.run({
      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      eachMessage: async (event: any) => {
        messagesConsumed.push(event)
      },
    })
    await waitForMessages(messagesConsumed, { number: 13 })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(messagesConsumed.filter(({ partition }) => partition === 0)).toHaveLength(6) // 13 original minus 7 deleted
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(messagesConsumed.find(({
      partition
    }: any) => partition === 0)).toEqual(
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect.objectContaining({
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        message: expect.objectContaining({ offset: '7' }), // first message is offset 7
      })
    )
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(
      messagesConsumed
        .slice()
        .reverse()
        .find(({
        partition
      }: any) => partition === 0)
    ).toEqual(
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect.objectContaining({
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        message: expect.objectContaining({ offset: '12' }), // last message is offset 12
      })
    )

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(messagesConsumed.filter(({ partition }) => partition === 1)).toHaveLength(7) // original number of messages
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('deletes all records when provided the -1 offset', async () => {
    const recordsToDelete = [{ partition: 0, offset: '-1' }]

    await admin.deleteTopicRecords({ topic: topicName, partitions: recordsToDelete })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(
      await cluster.fetchTopicsOffset([
        {
          topic: topicName,
          partitions: [{ partition: 0 }],
          fromBeginning: true,
        },
      ])
    ).toEqual([
      {
        topic: topicName,
        partitions: [{ partition: 0, offset: '13' }],
      },
    ])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('in case of retriable error, tries again from the last successful partition (does not re-process successful partition twice)', async () => {
    // tries to delete from partition 0 AND partition 1 -> tries to call broker.deleteRecords twice
    const recordsToDelete = [
      { partition: 0, offset: '7' },
      { partition: 1, offset: '5' },
    ]
    brokerSpy.mockResolvedValueOnce() // succeed once
    brokerSpy.mockRejectedValueOnce(
      new KafkaJSDeleteTopicRecordsError({
        partitions: [
          {
            partition: 1,
            offset: '5',
            error: new KafkaJSProtocolError('retriable', { retriable: true }),
          },
        ],
      })
    ) // fail once

    await admin.deleteTopicRecords({ topic: topicName, partitions: recordsToDelete })

    // broker call #1 succeeds, broker call #2 fails, call #3 should be the last one (skips broker #1, and only retries #2)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(brokerSpy).toHaveBeenCalledTimes(3)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(brokerSpy.mock.calls[1]).not.toEqual(brokerSpy.mock.calls[0])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(brokerSpy.mock.calls[2]).toEqual(brokerSpy.mock.calls[1])
  })

  for (const error of STALE_METADATA_ERRORS) {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test(`${error.type || error.name} refresh stale metadata and tries again`, async () => {
      brokerSpy.mockRejectedValueOnce(
        new KafkaJSDeleteTopicRecordsError({
          partitions: [
            {
              partition: 1,
              offset: '5',
              error,
            },
          ],
        })
      )

      const recordsToDelete = [{ partition: 1, offset: '5' }]
      await admin.deleteTopicRecords({ topic: topicName, partitions: recordsToDelete })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerSpy).toHaveBeenCalledTimes(2)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(metadataSpy).toHaveBeenCalled()
    })
  }

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('in case at least one partition does not exist/has no leader, throws before processing any partitions', async () => {
    // try to add to the delete request a partition that doesn't exist
    const recordsToDelete = [
      { partition: 0, offset: '7' },
      { partition: 2, offset: '5' },
    ]

    let error
    try {
      await admin.deleteTopicRecords({ topic: topicName, partitions: recordsToDelete })
    } catch (e) {
      error = e
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error).toBeDefined()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error.name).toBe('KafkaJSDeleteTopicRecordsError')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error.retriable).toBe(false)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error.partitions).toEqual([
      {
        partition: 2,
        offset: '5',
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
        error: new KafkaJSBrokerNotFound('Could not find the leader for the partition'),
      },
    ])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(brokerSpy).not.toHaveBeenCalled()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('in case offset is below low watermark, log a warning', async () => {
    // delete #1 to set the low watermark to 5
    let recordsToDelete = [{ partition: 1, offset: '5' }]
    await admin.deleteTopicRecords({ topic: topicName, partitions: recordsToDelete })
    // delete #2
    recordsToDelete = [
      { partition: 0, offset: '7' }, // work as normal
      { partition: 1, offset: '3' }, // logs a warning + no effect on the partition
    ]
    await admin.deleteTopicRecords({ topic: topicName, partitions: recordsToDelete })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(logger.warn).toHaveBeenCalledTimes(1)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(
      logger.warn
    ).toHaveBeenCalledWith(
      'The requested offset is before the earliest offset maintained on the partition - no records will be deleted from this partition',
      { topic: topicName, partition: 1, offset: '3' }
    )
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(
      await cluster.fetchTopicsOffset([
        {
          topic: topicName,
          partitions: [{ partition: 0 }, { partition: 1 }],
          fromBeginning: true,
        },
      ])
    ).toEqual([
      {
        topic: topicName,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        partitions: expect.arrayContaining([
          { partition: 0, offset: '7' },
          { partition: 1, offset: '5' },
        ]),
      },
    ])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('if 1 of the broker request offsets is out-of-range (non-retriable), the request in its entirety throws an error', async () => {
    const recordsToDelete = [
      { partition: 0, offset: '7' },
      { partition: 1, offset: '99' },
    ]

    let error
    try {
      await admin.deleteTopicRecords({ topic: topicName, partitions: recordsToDelete })
    } catch (e) {
      error = e
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error).toBeDefined()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error.name).toBe('KafkaJSNumberOfRetriesExceeded')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error.originalError.name).toBe('KafkaJSDeleteTopicRecordsError')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error.originalError.retriable).toBe(false)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error.originalError.partitions).toEqual([
      {
        partition: 1,
        offset: '99',
        error: new KafkaJSOffsetOutOfRange(
          'The requested offset is not within the range of offsets maintained by the server',
          { topic: topicName, partition: 0 }
        ),
      },
    ])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(
      await cluster.fetchTopicsOffset([
        {
          topic: topicName,
          partitions: [{ partition: 0 }, { partition: 1 }],
          fromBeginning: true,
        },
      ])
    ).toEqual([
      {
        topic: topicName,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        partitions: expect.arrayContaining([
          { partition: 0, offset: '7' },
          { partition: 1, offset: '0' },
        ]),
      },
    ])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('if at least 1 broker error is non-retriable, will not attempt to retry', async () => {
    const recordsToDelete = [
      { partition: 0, offset: '7' },
      { partition: 1, offset: '5' },
    ]
    brokerSpy.mockRejectedValueOnce(
      new KafkaJSDeleteTopicRecordsError({
        partitions: [
          {
            partition: 0,
            offset: '7',
            error: new KafkaJSProtocolError('retriable', { retriable: true }),
          },
        ],
      })
    )
    brokerSpy.mockRejectedValueOnce(
      new KafkaJSDeleteTopicRecordsError({
        partitions: [
          { partition: 1, offset: '5', error: new KafkaJSNonRetriableError('nonretriable') },
        ],
      })
    )

    let error
    try {
      await admin.deleteTopicRecords({ topic: topicName, partitions: recordsToDelete })
    } catch (e) {
      error = e
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error).toBeDefined()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error.name).toBe('KafkaJSNumberOfRetriesExceeded')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error.originalError.name).toBe('KafkaJSDeleteTopicRecordsError')
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error.originalError.retriable).toBe(false)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(error.originalError.partitions).toEqual(
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect.arrayContaining([
        {
          partition: 0,
          offset: '7',
          error: new KafkaJSProtocolError('retriable'),
        },
        {
          partition: 1,
          offset: '5',
          error: new KafkaJSNonRetriableError('nonretriable'),
        },
      ])
    )
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(brokerSpy).toHaveBeenCalledTimes(2)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(
      await cluster.fetchTopicsOffset([
        {
          topic: topicName,
          partitions: [{ partition: 0 }, { partition: 1 }],
          fromBeginning: true,
        },
      ])
    ).toEqual([
      {
        topic: topicName,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        partitions: expect.arrayContaining([
          { partition: 0, offset: '0' },
          { partition: 1, offset: '0' },
        ]),
      },
    ])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('if all broker errors are retriable, will retry the request', async () => {
    const recordsToDelete = [
      { partition: 0, offset: '7' },
      { partition: 1, offset: '5' },
    ]
    brokerSpy.mockRejectedValueOnce(
      new KafkaJSDeleteTopicRecordsError({
        partitions: [
          {
            partition: 0,
            offset: '7',
            error: new KafkaJSProtocolError('retriable', { retriable: true }),
          },
        ],
      })
    )
    brokerSpy.mockRejectedValueOnce(
      new KafkaJSDeleteTopicRecordsError({
        partitions: [
          {
            partition: 1,
            offset: '5',
            error: new KafkaJSProtocolError('retriable', { retriable: true }),
          },
        ],
      })
    )

    await admin.deleteTopicRecords({ topic: topicName, partitions: recordsToDelete })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(brokerSpy).toHaveBeenCalledTimes(4)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(
      await cluster.fetchTopicsOffset([
        {
          topic: topicName,
          partitions: [{ partition: 0 }, { partition: 1 }],
          fromBeginning: true,
        },
      ])
    ).toEqual([
      {
        topic: topicName,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        partitions: expect.arrayContaining([
          { partition: 0, offset: '7' },
          { partition: 1, offset: '5' },
        ]),
      },
    ])
  })
})
