// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV3P... Remove this comment to see the full error message
const RequestV3Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > Produce > v3', () => {
  let args: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    args = {
      transactionalId: null,
      acks: -1,
      timeout: 30000,
      compression: 0,
      topicData: [
        {
          topic: 'test-topic-ebba68879c6f5081d8c2',
          partitions: [
            {
              partition: 0,
              firstSequence: 0,
              messages: [
                {
                  key: 'key-9d0f348cb2e730e1edc4',
                  value: 'some-value-a17b4c81f9ecd1e896e3',
                  timestamp: 1509928155660,
                  headers: { a: 'b' },
                },
              ],
            },
          ],
        },
      ],
    }
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when acks=0', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('expectResponse returns false', () => {
      const request = RequestV3Protocol({ ...args, acks: 0 })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.expectResponse()).toEqual(false)
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const { buffer } = await RequestV3Protocol({
      transactionalId: null,
      acks: -1,
      timeout: 30000,
      compression: 0,
      topicData: [
        {
          topic: 'test-topic-ebba68879c6f5081d8c2',
          partitions: [
            {
              partition: 0,
              firstSequence: 10,
              messages: [
                {
                  key: 'key-9d0f348cb2e730e1edc4',
                  value: 'some-value-a17b4c81f9ecd1e896e3',
                  timestamp: 1509928155660,
                  headers: { a: 'b' },
                },
                {
                  key: 'key-c7073e965c34b4cc6442',
                  value: 'some-value-65df422070d7ad73914f',
                  timestamp: 1509928155660,
                  headers: { a: 'b' },
                },
                {
                  key: 'key-1693b184a9b52dbe03bc',
                  value: 'some-value-3fcb65ffca087cba20ad',
                  timestamp: 1509928155660,
                  headers: { a: 'b' },
                },
              ],
            },
          ],
        },
      ],
    }).encode()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v3_request.json')))
  })
})
