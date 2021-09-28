// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSNon... Remove this comment to see the full error message
const { KafkaJSNonRetriableError } = require('../errors')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sleep'.
const sleep = require('./sleep')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'concurrenc... Remove this comment to see the full error message
const concurrency = require('./concurrency')

const after = async (delay: any, fn: any) =>
  // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
  new Promise((resolve: any) => setTimeout(() => {
    resolve(fn())
  }, delay)
  )

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Utils > concurrency', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws when called with a concurrency of 0 or less', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(() => concurrency()).toThrowWithMessage(
      KafkaJSNonRetriableError,
      '"limit" cannot be less than 1'
    )

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(() => concurrency({ limit: 0 })).toThrowWithMessage(
      KafkaJSNonRetriableError,
      '"limit" cannot be less than 1'
    )

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(() => concurrency({ limit: NaN })).toThrowWithMessage(
      KafkaJSNonRetriableError,
      '"limit" cannot be less than 1'
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('invokes functions in sequence with concurrency of 1', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const onChange = jest.fn()
    const sequentially = concurrency({ limit: 1, onChange })
    const input = [
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      [jest.fn().mockReturnValue(1), 50],
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      [jest.fn().mockReturnValue(2), 100],
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      [jest.fn().mockReturnValue(3), 10],
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      [jest.fn().mockReturnValue(4), 10],
    ]
    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    const result = await Promise.all(
      input.map(([fn, delay]) => sequentially(async () => after(delay, fn)))
    )

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(result).toEqual([1, 2, 3, 4])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(input[0][0]).toHaveBeenCalledBefore(input[1][0])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(input[2][0]).toHaveBeenCalledBefore(input[3][0])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onChange.mock.calls).toEqual([[1], [0], [1], [0], [1], [0], [1], [0]])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('invokes functions concurrently when the limit allows', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const onChange = jest.fn()
    const concurrently = concurrency({ limit: 2, onChange })
    const input = [
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      [jest.fn().mockReturnValue(1), 50],
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      [jest.fn().mockReturnValue(2), 100],
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      [jest.fn().mockReturnValue(3), 10],
    ]

    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    const result = await Promise.all(
      input.map(([fn, delay]) => concurrently(async () => after(delay, fn)))
    )

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(result).toEqual([1, 2, 3])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onChange.mock.calls).toEqual([[1], [2], [1], [2], [1], [0]])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('rejects without continuing the chain if there are any errors', async () => {
    const concurrently = concurrency({ limit: 2 })
    const input = [
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      [jest.fn(), 1000],
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      [jest.fn().mockRejectedValue(new Error('💣')), 500],
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      [jest.fn(), 1],
    ]

    const promises = input.map(([fn, delay]) => concurrently(async () => after(delay, fn)))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(Promise.all(promises)).rejects.toThrow('💣')
    await sleep(1)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(input[2][0]).not.toHaveBeenCalled()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(promises[2]).rejects.toEqual(
      new KafkaJSNonRetriableError('Queued function aborted due to earlier promise rejection')
    )
  })
})
