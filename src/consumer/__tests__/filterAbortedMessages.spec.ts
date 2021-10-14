// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const abortedBatch = require('./fixtures/batches/aborted')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const committedBatch = require('./fixtures/batches/committed')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const nontransactionalBatch = require('./fixtures/batches/nontransactional')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'filterAbor... Remove this comment to see the full error message
const filterAbortedMessages = require('../filterAbortedMessages')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('filterAbortedMessages', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('filters out all aborted messages', () => {
    const { messages, abortedTransactions } = abortedBatch
    const { messages: nontransactionalMessages } = nontransactionalBatch

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(messages).toHaveLength(3)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(abortedTransactions).toHaveLength(1)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(filterAbortedMessages({ messages, abortedTransactions })).toStrictEqual([
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect.objectContaining({
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
        key: Buffer.from([0, 0, 0, 0]), // Abort control message
      }),
    ])

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(
      filterAbortedMessages({
        messages: [...messages, ...nontransactionalMessages],
        abortedTransactions,
      })
    ).toStrictEqual([
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect.objectContaining({
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
        key: Buffer.from([0, 0, 0, 0]),
      }),
      ...nontransactionalMessages,
    ])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('filters out aborted messages with malformed keys', () => {
    const { messages, abortedTransactions } = abortedBatch
    const { messages: nontransactionalMessages } = nontransactionalBatch
    messages[messages.length - 2].key = null
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(
      filterAbortedMessages({
        messages: [...messages, ...nontransactionalMessages],
        abortedTransactions,
      })
    ).toStrictEqual([
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect.objectContaining({
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
        key: Buffer.from([0, 0, 0, 0]),
      }),
      ...nontransactionalMessages,
    ])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('returns all committed messages', () => {
    const { messages, abortedTransactions } = committedBatch
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(messages).toHaveLength(4)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(abortedTransactions).toHaveLength(0)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(filterAbortedMessages({ messages, abortedTransactions })).toStrictEqual(messages)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('returns all nontransactional messages', () => {
    const { messages, abortedTransactions } = nontransactionalBatch
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(messages).toHaveLength(3)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(abortedTransactions).toHaveLength(0)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(filterAbortedMessages({ messages, abortedTransactions })).toStrictEqual(messages)
  })
})
