// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitFor'.
import waitFor from './waitFor'
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'flatten'.
import flatten from './flatten'
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Lock'.
import Lock from './lock'

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sleep'.
const sleep = (value: any) => waitFor((delay: any) => delay >= value)

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Utils > Lock', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('allows only one resource at a time', async () => {
    const lock = new Lock({ timeout: 1000 })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const resource = jest.fn()
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    const callResource = async () => {
      try {
        await lock.acquire()
        resource(Date.now())
        await sleep(50)
      } finally {
        await lock.release()
      }
    }

    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all([callResource(), callResource(), callResource()])
    const calls = flatten(resource.mock.calls)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(calls.length).toEqual(3)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(calls[1] - calls[0]).toBeGreaterThanOrEqual(50)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(calls[2] - calls[1]).toBeGreaterThanOrEqual(50)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws an error if the lock cannot be acquired within a period', async () => {
    const lock = new Lock({ timeout: 60 })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const resource = jest.fn()
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    const callResource = async () => {
      await lock.acquire()
      resource(Date.now())
      await sleep(50)
      // it never releases the lock
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(
      // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
      Promise.all([callResource(), callResource(), callResource()])
    ).rejects.toHaveProperty('message', 'Timeout while acquiring lock (2 waiting locks)')
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws if the lock is initiated with an undefined timeout', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(() => new Lock()).toThrowWithMessage(
      TypeError,
      `'timeout' is not a number, received 'undefined'`
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('allows lock to be acquired after timeout', async () => {
    const lock = new Lock({ timeout: 60 })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const resource = jest.fn()
    // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
    const callResource = async () => {
      await lock.acquire()
      try {
        resource(Date.now())
        await sleep(100)
      } finally {
        lock.release()
      }
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(
      // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
      Promise.all([callResource(), callResource(), callResource()])
    ).rejects.toHaveProperty('message', 'Timeout while acquiring lock (2 waiting locks)')

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(callResource()).resolves.toBeUndefined()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('with a description', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error with the configured description if the lock cannot be acquired within a period', async () => {
      const lock = new Lock({ timeout: 60, description: 'My test mock' })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const resource = jest.fn()
      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      const callResource = async () => {
        await lock.acquire()
        resource(Date.now())
        await sleep(50)
        // it never releases the lock
      }

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
        Promise.all([callResource(), callResource(), callResource()])
      ).rejects.toHaveProperty(
        'message',
        'Timeout while acquiring lock (2 waiting locks): "My test mock"'
      )
    })
  })
})
