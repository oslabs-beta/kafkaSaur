// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Runner'.
const Runner = require('../runner')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Batch'.
const Batch = require('../batch')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSPro... Remove this comment to see the full error message
const { KafkaJSProtocolError, KafkaJSNotImplemented } = require('../../errors')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createErro... Remove this comment to see the full error message
const { createErrorFromCode } = require('../../protocol/error')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Instrument... Remove this comment to see the full error message
const InstrumentationEventEmitter = require('../../instrumentation/emitter')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
const { newLogger, secureRandom } = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sleep'.
const sleep = require('../../utils/sleep')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BufferedAs... Remove this comment to see the full error message
const BufferedAsyncIterator = require('../../utils/bufferedAsyncIterator')

const UNKNOWN = -1
const REBALANCE_IN_PROGRESS = 27
const rebalancingError = () => new KafkaJSProtocolError(createErrorFromCode(REBALANCE_IN_PROGRESS))

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer > Runner', () => {
  let runner: any, consumerGroup: any, onCrash: any, eachBatch: any, topicName: any, partition: any, emptyBatch: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    topicName = `topic-${secureRandom()}`
    partition = 0

    emptyBatch = new Batch(topicName, 0, {
      partition,
      highWatermark: 5,
      messages: [],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    eachBatch = jest.fn()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    onCrash = jest.fn()
    consumerGroup = {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      connect: jest.fn(),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      join: jest.fn(),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      sync: jest.fn(),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      joinAndSync: jest.fn(),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      fetch: jest.fn(() => BufferedAsyncIterator([Promise.resolve([emptyBatch])])),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      resolveOffset: jest.fn(),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      commitOffsets: jest.fn(),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      commitOffsetsIfNecessary: jest.fn(),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      uncommittedOffsets: jest.fn(),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      heartbeat: jest.fn(),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      assigned: jest.fn(() => []),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      isLeader: jest.fn(() => true),
    }
    const instrumentationEmitter = new InstrumentationEventEmitter()
    runner = new Runner({
      consumerGroup,
      instrumentationEmitter,
      onCrash,
      logger: newLogger(),
      eachBatch,
      partitionsConsumedConcurrently: 1,
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when the group is rebalancing before the new consumer has joined', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('recovers from rebalance in progress and re-join the group', async () => {
      consumerGroup.sync
        .mockImplementationOnce(() => {
          throw rebalancingError()
        })
        .mockImplementationOnce(() => {
          throw rebalancingError()
        })
        .mockImplementationOnce(() => true)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      runner.scheduleFetch = jest.fn()
      await runner.start()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(runner.scheduleFetch).toHaveBeenCalled()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onCrash).not.toHaveBeenCalled()
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should "commit" offsets during fetch', async () => {
    const batch = new Batch(topicName, 0, {
      partition,
      highWatermark: 5,
      messages: [{ offset: 4, key: '1', value: '2' }],
    })

    consumerGroup.fetch.mockImplementationOnce(() =>
      // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
      BufferedAsyncIterator([Promise.resolve([batch])])
    )
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    runner.scheduleFetch = jest.fn()
    await runner.start()
    await runner.fetch() // Manually fetch for test
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(eachBatch).toHaveBeenCalled()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(consumerGroup.commitOffsets).toHaveBeenCalled()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onCrash).not.toHaveBeenCalled()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('"eachBatch" callback', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('allows providing offsets to "commitOffsetIfNecessary"', async () => {
      const batch = new Batch(topicName, 0, {
        partition,
        highWatermark: 5,
        messages: [{ offset: 4, key: '1', value: '2' }],
      })

      consumerGroup.fetch.mockImplementationOnce(() =>
        // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
        BufferedAsyncIterator([Promise.resolve([batch])])
      )
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      runner.scheduleFetch = jest.fn()
      await runner.start()
      await runner.fetch() // Manually fetch for test

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(eachBatch).toHaveBeenCalledWith(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.objectContaining({
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          commitOffsetsIfNecessary: expect.any(Function),
        })
      )

      const { commitOffsetsIfNecessary } = eachBatch.mock.calls[0][0] // Access the callback

      // Clear state
      consumerGroup.commitOffsetsIfNecessary.mockClear()
      consumerGroup.commitOffsets.mockClear()

      // No offsets provided
      await commitOffsetsIfNecessary()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumerGroup.commitOffsetsIfNecessary).toHaveBeenCalledTimes(1)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumerGroup.commitOffsets).toHaveBeenCalledTimes(0)

      // Clear state
      consumerGroup.commitOffsetsIfNecessary.mockClear()
      consumerGroup.commitOffsets.mockClear()

      // Provide offsets
      const offsets = {
        topics: [{ topic: topicName, partitions: [{ offset: '1', partition: 0 }] }],
      }

      await commitOffsetsIfNecessary(offsets)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumerGroup.commitOffsetsIfNecessary).toHaveBeenCalledTimes(0)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumerGroup.commitOffsets).toHaveBeenCalledTimes(1)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumerGroup.commitOffsets).toHaveBeenCalledWith(offsets)
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when eachBatchAutoResolve is set to false', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      runner = new Runner({
        consumerGroup,
        instrumentationEmitter: new InstrumentationEventEmitter(),
        eachBatchAutoResolve: false,
        eachBatch,
        onCrash,
        logger: newLogger(),
        partitionsConsumedConcurrently: 1,
      })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      runner.scheduleFetch = jest.fn(() => runner.fetch())
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not call resolveOffset with the last offset', async () => {
      const batch = new Batch(topicName, 0, {
        partition,
        highWatermark: 5,
        messages: [{ offset: 4, key: '1', value: '2' }],
      })

      consumerGroup.fetch.mockImplementationOnce(() =>
        // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
        BufferedAsyncIterator([Promise.resolve([batch])])
      )
      await runner.start()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onCrash).not.toHaveBeenCalled()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumerGroup.resolveOffset).not.toHaveBeenCalled()
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when autoCommit is set to false', () => {
    let eachBatchCallUncommittedOffsets: any

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      eachBatchCallUncommittedOffsets = jest.fn(({
        uncommittedOffsets
      }: any) => {
        uncommittedOffsets()
      })

      runner = new Runner({
        consumerGroup,
        instrumentationEmitter: new InstrumentationEventEmitter(),
        eachBatch: eachBatchCallUncommittedOffsets,
        onCrash,
        autoCommit: false,
        logger: newLogger(),
        partitionsConsumedConcurrently: 1,
      })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      runner.scheduleFetch = jest.fn(() => runner.fetch())
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not commit offsets during fetch', async () => {
      const batch = new Batch(topicName, 0, {
        partition,
        highWatermark: 5,
        messages: [{ offset: 4, key: '1', value: '2' }],
      })

      consumerGroup.fetch.mockImplementationOnce(() =>
        // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
        BufferedAsyncIterator([Promise.resolve([batch])])
      )
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      runner.scheduleFetch = jest.fn()
      await runner.start()
      await runner.fetch() // Manually fetch for test

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumerGroup.commitOffsets).not.toHaveBeenCalled()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumerGroup.commitOffsetsIfNecessary).not.toHaveBeenCalled()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(eachBatchCallUncommittedOffsets).toHaveBeenCalled()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumerGroup.uncommittedOffsets).toHaveBeenCalled()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onCrash).not.toHaveBeenCalled()
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls onCrash for any other errors', async () => {
    const unknownError = new KafkaJSProtocolError(createErrorFromCode(UNKNOWN))
    consumerGroup.joinAndSync
      .mockImplementationOnce(() => {
        throw unknownError
      })
      .mockImplementationOnce(() => true)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    runner.scheduleFetch = jest.fn()
    await runner.start()

    // scheduleFetch in runner#start is async, and we never wait for it,
    // so we have to wait a bit to give the callback a chance of being executed
    await sleep(100)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(runner.scheduleFetch).not.toHaveBeenCalled()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onCrash).toHaveBeenCalledWith(unknownError)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('crashes on KafkaJSNotImplemented errors', async () => {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    const notImplementedError = new KafkaJSNotImplemented('not implemented')
    consumerGroup.fetch.mockImplementationOnce(() =>
      // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
      BufferedAsyncIterator([Promise.reject(notImplementedError)])
    )

    await runner.start()

    // scheduleFetch in runner#start is async, and we never wait for it,
    // so we have to wait a bit to give the callback a chance of being executed
    await sleep(100)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onCrash).toHaveBeenCalledWith(notImplementedError)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('commitOffsets', () => {
    let offsets: any

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(async () => {
      offsets = { topics: [{ topic: topicName, partitions: [{ offset: '1', partition }] }] }
      await runner.start()

      consumerGroup.joinAndSync.mockClear()
      consumerGroup.commitOffsetsIfNecessary.mockClear()
      consumerGroup.commitOffsets.mockClear()
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should commit offsets while running', async () => {
      await runner.commitOffsets(offsets)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumerGroup.commitOffsetsIfNecessary).toHaveBeenCalledTimes(0)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumerGroup.commitOffsets.mock.calls.length).toBeGreaterThanOrEqual(1)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumerGroup.commitOffsets).toHaveBeenCalledWith(offsets)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw when group is rebalancing, while triggering another join', async () => {
      const error = rebalancingError()
      consumerGroup.commitOffsets.mockImplementationOnce(() => {
        throw error
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(runner.commitOffsets(offsets)).rejects.toThrow(error.message)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumerGroup.joinAndSync).toHaveBeenCalledTimes(0)

      await sleep(100)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(consumerGroup.joinAndSync).toHaveBeenCalledTimes(1)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('correctly catch exceptions in parallel "eachBatch" processing', async () => {
      runner = new Runner({
        consumerGroup,
        instrumentationEmitter: new InstrumentationEventEmitter(),
        eachBatchAutoResolve: false,
        // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
        eachBatch: async () => {
          throw new Error('Error while processing batches in parallel')
        },
        onCrash,
        logger: newLogger(),
        partitionsConsumedConcurrently: 10,
      })

      const batch = new Batch(topicName, 0, {
        partition,
        highWatermark: 5,
        messages: [{ offset: 4, key: '1', value: '2' }],
      })

      // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
      const longRunningRequest = new Promise((resolve: any) => {
        setTimeout(() => resolve([]), 100)
      })

      consumerGroup.fetch.mockImplementationOnce(() =>
        // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
        BufferedAsyncIterator([longRunningRequest, Promise.resolve([batch])])
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      runner.scheduleFetch = jest.fn()
      await runner.start()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(runner.fetch()).rejects.toThrow('Error while processing batches in parallel')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('correctly catch exceptions in parallel "heartbeat" processing', async () => {
      const batch = new Batch(topicName, 0, {
        partition,
        highWatermark: 5,
        messages: [{ offset: 4, key: '1', value: '2' }],
      })

      // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
      const longRunningRequest = new Promise((resolve: any) => {
        setTimeout(() => resolve([]), 100)
      })

      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      consumerGroup.heartbeat = async () => {
        throw new Error('Error while processing heartbeats in parallel')
      }

      consumerGroup.fetch.mockImplementationOnce(() =>
        // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
        BufferedAsyncIterator([longRunningRequest, Promise.resolve([batch])])
      )

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      runner.scheduleFetch = jest.fn()
      await runner.start()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(runner.fetch()).rejects.toThrow('Error while processing heartbeats in parallel')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('a triggered rejoin failing should cause a crash', async () => {
      const unknownError = new KafkaJSProtocolError(createErrorFromCode(UNKNOWN))
      consumerGroup.joinAndSync.mockImplementationOnce(() => {
        throw unknownError
      })
      consumerGroup.commitOffsets.mockImplementationOnce(() => {
        throw rebalancingError()
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(runner.commitOffsets(offsets)).rejects.toThrow(rebalancingError().message)

      await sleep(100)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onCrash).toHaveBeenCalledWith(unknownError)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should ignore request errors from BufferedAsyncIterator on stopped consumer', async () => {
      const rejectedRequest = () =>
        // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
        new Promise((resolve: any, reject: any) => {
          setTimeout(() => reject(new Error('Failed or manually rejected request')), 10)
        })

      consumerGroup.fetch.mockImplementationOnce(() => {
        // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
        return new Promise((resolve: any) => setTimeout(() => {
          // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
          resolve(BufferedAsyncIterator([rejectedRequest(), Promise.resolve([])]))
        }, 10)
        );
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      runner.scheduleFetch = jest.fn()
      await runner.start()
      runner.running = false

      runner.fetch()
      await sleep(100)
    })
  })
})
