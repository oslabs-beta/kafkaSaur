// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'websiteUrl... Remove this comment to see the full error message
const websiteUrl = require('./websiteUrl')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Utils > websiteUrl', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('generates links to the website', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(websiteUrl('docs/faq')).toEqual('https://kafka.js.org/docs/faq')
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('allows specifying a hash', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(
      websiteUrl('docs/faq', 'why-am-i-receiving-messages-for-topics-i-m-not-subscribed-to')
    ).toEqual(
      'https://kafka.js.org/docs/faq#why-am-i-receiving-messages-for-topics-i-m-not-subscribed-to'
    )
  })
})
