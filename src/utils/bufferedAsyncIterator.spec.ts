// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.setTimeout(1000)

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sleep'.
import sleep from './sleep'
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BufferedAs... Remove this comment to see the full error message
import BufferedAsyncIterator from './bufferedAsyncIterator'

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Utils > BufferedAsyncIterator', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('yields an empty iterator if passed an empty array of promises', async () => {
    const iterator = BufferedAsyncIterator([])
    const result = iterator.next()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(result.done).toBe(true)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('provide the values as they become available', async () => {
    const promises = [sleep(300).then(() => 1), sleep(100).then(() => 2), sleep(500).then(() => 3)]
    const iterator = BufferedAsyncIterator(promises)
    const testResults = []

    while (true) {
      const result = iterator.next()
      if (result.done) {
        break
      }

      const value = await result.value
      testResults.push(value)
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(testResults).toEqual([2, 1, 3])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('does not lose values even if they finish at the "same" time', async () => {
    const promises = [sleep(100).then(() => 1), sleep(100).then(() => 2), sleep(100).then(() => 3)]
    const iterator = BufferedAsyncIterator(promises)
    const testResults = []

    while (true) {
      const result = iterator.next()
      if (result.done) {
        break
      }

      const value = await result.value
      testResults.push(value)
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(testResults).toEqual([1, 2, 3])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('works with eager consumers', async () => {
    const promises = [sleep(300).then(() => 1), sleep(100).then(() => 2), sleep(500).then(() => 3)]
    const iterator = BufferedAsyncIterator(promises)
    const testResults = []

    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    const firstResult = await Promise.all([iterator.next().value, iterator.next().value])
    testResults.push(...firstResult)

    const value = await iterator.next().value
    testResults.push(value)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(testResults).toEqual([2, 1, 3])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('allows errors to be handled on the creator context', async () => {
    const promises = [
      sleep(300).then(() => {
        throw new Error(`Error-1`)
      }),
      sleep(100).then(() => {
        throw new Error(`Error-2`)
      }),
      sleep(500).then(() => {
        throw new Error(`Error-3`)
      }),
    ]

    let hasRecovered = false
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const handleError = jest.fn()
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    const recover = async (e: any) => {
      hasRecovered = true
      throw e
    }
    const iterator = BufferedAsyncIterator(promises, recover)
    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all([iterator.next().value, iterator.next().value, iterator.next().value]).catch(
      handleError
    )
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(handleError).toHaveBeenCalledWith(new Error('Error-2'))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(hasRecovered).toEqual(true)
  })
})
