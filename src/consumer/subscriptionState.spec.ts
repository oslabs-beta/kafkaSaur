// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Subscripti... Remove this comment to see the full error message
const SubscriptionState = require('./subscriptionState')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer > SubscriptionState > pause / resume', () => {
  let subscriptionState: any
  const byTopic = (a: any, b: any) => a.topic - b.topic

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    subscriptionState = new SubscriptionState()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('pauses the selected topics', () => {
    subscriptionState.pause([{ topic: 'topic1' }, { topic: 'topic2' }])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subscriptionState.paused().sort(byTopic)).toEqual([])

    subscriptionState.assign([
      { topic: 'topic1', partitions: [0, 1] },
      { topic: 'topic2', partitions: [1, 2] },
    ])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subscriptionState.paused().sort(byTopic)).toEqual([
      { topic: 'topic1', partitions: [0, 1] },
      { topic: 'topic2', partitions: [1, 2] },
    ])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('resumes the selected topics', () => {
    subscriptionState.pause([{ topic: 'topic1' }, { topic: 'topic2' }])
    subscriptionState.assign([
      { topic: 'topic1', partitions: [0, 1] },
      { topic: 'topic2', partitions: [1, 2] },
    ])
    subscriptionState.resume([{ topic: 'topic2' }])

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subscriptionState.paused().sort(byTopic)).toEqual([
      { topic: 'topic1', partitions: [0, 1] },
    ])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('pauses the selected partitions', () => {
    subscriptionState.pause([{ topic: 'topic1', partitions: [0, 1] }])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subscriptionState.paused()).toEqual([])

    subscriptionState.assign([{ topic: 'topic1', partitions: [0, 1, 2, 3] }])

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subscriptionState.paused().sort(byTopic)).toEqual([
      { topic: 'topic1', partitions: [0, 1] },
    ])

    subscriptionState.pause([{ topic: 'topic1', partitions: [1, 2] }])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subscriptionState.paused().sort(byTopic)).toEqual([
      { topic: 'topic1', partitions: [0, 1, 2] },
    ])

    subscriptionState.pause([{ topic: 'topic1', partitions: [4] }])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subscriptionState.paused().sort(byTopic)).toEqual([
      { topic: 'topic1', partitions: [0, 1, 2] },
    ])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('resumes the selected partitions', () => {
    subscriptionState.pause([{ topic: 'topic1', partitions: [0, 1] }])
    subscriptionState.assign([{ topic: 'topic1', partitions: [0, 1, 2, 3] }])
    subscriptionState.resume([{ topic: 'topic1', partitions: [1] }])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subscriptionState.paused().sort(byTopic)).toEqual([{ topic: 'topic1', partitions: [0] }])

    subscriptionState.resume([{ topic: 'topic1', partitions: [4] }])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subscriptionState.paused().sort(byTopic)).toEqual([{ topic: 'topic1', partitions: [0] }])

    subscriptionState.pause([{ topic: 'topic1' }])
    subscriptionState.resume([{ topic: 'topic1', partitions: [1] }])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subscriptionState.paused().sort(byTopic)).toEqual([
      { topic: 'topic1', partitions: [0, 2, 3] },
    ])
  })
})

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer > SubscriptionState > isPaused', () => {
  let subscriptionState: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    subscriptionState = new SubscriptionState()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('can determine whether a topic partition is paused', () => {
    subscriptionState.pause([{ topic: 'topic1', partitions: [0, 1] }, { topic: 'topic2' }])

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subscriptionState.isPaused('topic1', 0)).toEqual(true)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subscriptionState.isPaused('topic1', 2)).toEqual(false)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subscriptionState.isPaused('topic2', 0)).toEqual(true)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subscriptionState.isPaused('topic2', 2)).toEqual(true)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subscriptionState.isPaused('unknown', 0)).toEqual(false)
  })
})

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer > SubcriptionState > assignments', () => {
  let subscriptionState: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    subscriptionState = new SubscriptionState()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('can track assigned partitions per topic', () => {
    subscriptionState.assign([{ topic: 'topic1', partitions: [0, 1] }])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subscriptionState.active()).toEqual([{ topic: 'topic1', partitions: [0, 1] }])

    subscriptionState.assign([{ topic: 'topic2', partitions: [3, 4] }])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subscriptionState.active()).toEqual([{ topic: 'topic2', partitions: [3, 4] }])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('can return which topic partitions are assigned and not paused', () => {
    subscriptionState.assign([{ topic: 'topic1', partitions: [0, 1] }])
    subscriptionState.pause([{ topic: 'topic1', partitions: [0] }])

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subscriptionState.active()).toEqual([
      {
        topic: 'topic1',
        partitions: [1],
      },
    ])

    subscriptionState.pause([{ topic: 'topic2' }])
    subscriptionState.assign([{ topic: 'topic2', partitions: [0, 1, 2, 6, 7] }])
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subscriptionState.active()).toEqual([
      {
        topic: 'topic2',
        partitions: [],
      },
    ])
  })
})
