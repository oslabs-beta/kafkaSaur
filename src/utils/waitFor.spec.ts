// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitFor'.
const waitFor = require('./waitFor')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Utils > waitFor', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('waits for the condition', async () => {
    let conditionValid = false

    setTimeout(() => {
      conditionValid = true
    }, 6)

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(waitFor(() => conditionValid, { delay: 5 }))
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('rejects the promise if the callback fail', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(
      waitFor(
        () => {
          throw new Error('callback failed!')
        },
        { delay: 1 }
      )
    ).rejects.toHaveProperty('message', 'callback failed!')
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('rejects the promise if the callback never succeeds', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(waitFor(() => false, { delay: 1, maxWait: 2 })).rejects.toHaveProperty(
      'message',
      'Timeout'
    )
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('rejects the promise with a custom timeout message', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(
      waitFor(() => false, { delay: 1, maxWait: 2, timeoutMessage: 'foo bar' })
    ).rejects.toHaveProperty('message', 'foo bar')
  })
})
