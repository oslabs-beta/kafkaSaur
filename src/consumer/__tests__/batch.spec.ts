// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Batch'.
const Batch = require('../batch')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer > Batch', () => {
  const topic = 'topic-name'

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('discards messages with a lower offset than the requested', () => {
    const fetchedOffset = 3
    const batch = new Batch(topic, fetchedOffset, {
      partition: 0,
      highWatermark: '100',
      messages: [
        { offset: '0' },
        { offset: '1' },
        { offset: '2' },
        { offset: '3' },
        { offset: '4' },
        { offset: '5' },
      ],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(batch.messages).toEqual([{ offset: '3' }, { offset: '4' }, { offset: '5' }])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('discards control records', () => {
    const fetchedOffset = 0
    const batch = new Batch(topic, fetchedOffset, {
      partition: 0,
      highWatermark: '100',
      messages: [{ offset: '3', isControlRecord: true }, { offset: '4' }, { offset: '5' }],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(batch.messages).toEqual([{ offset: '4' }, { offset: '5' }])
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isEmpty', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when empty', () => {
      const batch = new Batch(topic, 0, {
        partition: 0,
        highWatermark: '100',
        messages: [],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(batch.isEmpty()).toEqual(true)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when it has messages', () => {
      const batch = new Batch(topic, 0, {
        partition: 0,
        highWatermark: '100',
        messages: [{ offset: '1' }, { offset: '2' }],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(batch.isEmpty()).toEqual(false)
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#firstOffset', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the offset of the first message', () => {
      const batch = new Batch(topic, 0, {
        partition: 0,
        highWatermark: '100',
        messages: [{ offset: '1' }, { offset: '2' }],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(batch.firstOffset()).toEqual('1')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns null when the batch is empty', () => {
      const batch = new Batch(topic, 0, {
        partition: 0,
        highWatermark: '100',
        messages: [],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(batch.firstOffset()).toEqual(null)
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#lastOffset', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the offset of the last message', () => {
      const batch = new Batch(topic, 0, {
        partition: 0,
        highWatermark: '100',
        messages: [{ offset: '1' }, { offset: '2' }],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(batch.lastOffset()).toEqual('2')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns highWatermark - 1 when the batch is empty', () => {
      const batch = new Batch(topic, 0, {
        partition: 0,
        highWatermark: '100',
        messages: [],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(batch.lastOffset()).toEqual('99')
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#offsetLag', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the difference between highWatermark - 1 and the last offset', () => {
      const batch = new Batch(topic, 0, {
        partition: 0,
        highWatermark: '100',
        messages: [{ offset: '3' }, { offset: '4' }],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(batch.offsetLag()).toEqual('95')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns 0 when the batch is empty', () => {
      const batch = new Batch(topic, 0, {
        partition: 0,
        highWatermark: '100',
        messages: [],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(batch.offsetLag()).toEqual('0')
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#offsetLagLow', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the difference between highWatermark - 1 and the first offset', () => {
      const batch = new Batch(topic, 0, {
        partition: 0,
        highWatermark: '100',
        messages: [{ offset: '3' }, { offset: '4' }],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(batch.offsetLagLow()).toEqual('96')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns 0 when the batch is empty', () => {
      const batch = new Batch(topic, 0, {
        partition: 0,
        highWatermark: '100',
        messages: [],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(batch.offsetLagLow()).toEqual('0')
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isEmptyControlRecord', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false for regular batches', () => {
      const batch = new Batch(topic, 0, {
        partition: 0,
        highWatermark: '100',
        messages: [{ offset: '3' }, { offset: '4' }],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(batch.isEmptyControlRecord()).toEqual(false)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false for regular empty batches', () => {
      const batch = new Batch(topic, 0, {
        partition: 0,
        highWatermark: '100',
        messages: [],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(batch.isEmptyControlRecord()).toEqual(false)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false if there is a control record but some messages are available', () => {
      const batch = new Batch(topic, 0, {
        partition: 0,
        highWatermark: '100',
        messages: [{ offset: '3' }, { offset: '4' }, { isControlRecord: true, offset: '5' }],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(batch.isEmptyControlRecord()).toEqual(false)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true if the batch only contains a control record', () => {
      const batch = new Batch(topic, 0, {
        partition: 0,
        highWatermark: '100',
        messages: [{ isControlRecord: true, offset: '5' }],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(batch.isEmptyControlRecord()).toEqual(true)
    })
  })
})
