// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.mock('./producer')
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.mock('./consumer')
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.mock('./admin')
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.mock('./cluster')

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { Kafka: Client } = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createProd... Remove this comment to see the full error message
const createProducer = require('./producer')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createCons... Remove this comment to see the full error message
const createConsumer = require('./consumer')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createAdmi... Remove this comment to see the full error message
const createAdmin = require('./admin')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Cluster'.
const Cluster = require('./cluster')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ISOLATION_... Remove this comment to see the full error message
const ISOLATION_LEVEL = require('./protocol/isolationLevel')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Client', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('gives access to its logger', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(new Client({ brokers: [] }).logger()).toMatchSnapshot()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('shares a commit mapping between the consumer and the producer', () => {
    const client = new Client({ brokers: [] })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(Cluster).toHaveBeenCalledTimes(0)

    client.producer({})
    client.consumer({})

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(Cluster).toHaveBeenCalledTimes(2)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(Cluster.mock.calls[0][0].offsets).toBeInstanceOf(Map)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(Cluster.mock.calls[0][0].offsets).toBe(Cluster.mock.calls[1][0].offsets)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(createProducer.mock.calls[0][0].cluster).toBe(Cluster.mock.instances[0])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(createConsumer.mock.calls[0][0].cluster).toBe(Cluster.mock.instances[1])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('passes options to the producer', () => {
    const client = new Client({ brokers: [] })
    const options = {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      cluster: expect.any(Object),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      logger: expect.any(Object),
      createPartitioner: () => 0,
      retry: { retries: 10 },
      idempotent: true,
      transactionalId: 'transactional-id',
      transactionTimeout: 1,
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      instrumentationEmitter: expect.any(Object),
    }
    client.producer(options)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(createProducer).toHaveBeenCalledWith(options)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('consumer', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('creates a consumer with the correct isolation level', () => {
      const client = new Client({ brokers: [] })

      const readCommittedConsumerOptions = {
        readUncommitted: false,
      }
      const readUncommittedConsumerOptions = {
        readUncommitted: true,
      }
      client.consumer(readCommittedConsumerOptions)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Cluster).toHaveBeenCalledWith(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.objectContaining({
          isolationLevel: ISOLATION_LEVEL.READ_COMMITTED,
        })
      )
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(createConsumer).toHaveBeenCalledWith(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.objectContaining({
          isolationLevel: ISOLATION_LEVEL.READ_COMMITTED,
        })
      )

      createConsumer.mockClear()
      Cluster.mockClear()
      client.consumer(readUncommittedConsumerOptions)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Cluster).toHaveBeenCalledWith(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.objectContaining({
          isolationLevel: ISOLATION_LEVEL.READ_UNCOMMITTED,
        })
      )
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(createConsumer).toHaveBeenCalledWith(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.objectContaining({
          isolationLevel: ISOLATION_LEVEL.READ_UNCOMMITTED,
        })
      )
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('retry configurations', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('merges local producer options with the client options', () => {
      const client = new Client({ retry: { initialRetryTime: 100 } })
      client.producer({ retry: { multiplier: 3 } })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(createProducer).toHaveBeenCalledWith(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.objectContaining({
          retry: { initialRetryTime: 100, multiplier: 3 },
        })
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('merges local consumer options with the client options', () => {
      const client = new Client({ retry: { initialRetryTime: 100 } })
      client.consumer({ retry: { multiplier: 3 } })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(createConsumer).toHaveBeenCalledWith(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.objectContaining({
          retry: { initialRetryTime: 100, multiplier: 3 },
        })
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('creates consumer with the default options', () => {
      const client = new Client({})
      client.consumer()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(createConsumer).toHaveBeenCalledWith(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.objectContaining({
          retry: { retries: 5 },
        })
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('merges local admin options with the client options', () => {
      const client = new Client({ retry: { initialRetryTime: 100 } })
      client.admin({ retry: { multiplier: 3 } })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(createAdmin).toHaveBeenCalledWith(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.objectContaining({
          retry: { initialRetryTime: 100, multiplier: 3 },
        })
      )
    })
  })
})
