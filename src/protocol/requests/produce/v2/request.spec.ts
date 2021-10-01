// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const os = require('os')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV2P... Remove this comment to see the full error message
const RequestV2Protocol = require('./request')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Types'.
const { Types } = require('../../../message/compression')

const osType = os.type().toLowerCase()

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > Produce > v2', () => {
  let args: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    args = {
      acks: -1,
      timeout: 30000,
      compression: 0,
      topicData: [
        {
          topic: 'test-topic-9f825c3f60bb0b4db583',
          partitions: [
            {
              partition: 0,
              messages: [
                {
                  key: 'key-bb252ae5801883c12bbd',
                  value: 'some-value-10340c6329f8bbf5b4a2',
                  timestamp: 1509819296569,
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
      const request = RequestV2Protocol({ ...args, acks: 0 })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(request.expectResponse()).toEqual(false)
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const { buffer } = await RequestV2Protocol({
      acks: -1,
      timeout: 30000,
      compression: 0,
      topicData: [
        {
          topic: 'test-topic-9f825c3f60bb0b4db583',
          partitions: [
            {
              partition: 0,
              messages: [
                {
                  key: 'key-bb252ae5801883c12bbd',
                  value: 'some-value-10340c6329f8bbf5b4a2',
                  timestamp: 1509819296569,
                },
                {
                  key: 'key-8a14e73a88e93f7c3a39',
                  value: 'some-value-4fa91513bffbcc0e34b3',
                  timestamp: 1509819296569,
                },
                {
                  key: 'key-183a2d8eb3683f080b82',
                  value: 'some-value-938afcf1f2ef0439c752',
                  timestamp: 1509819296569,
                },
              ],
            },
          ],
        },
      ],
    }).encode()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v2_request.json')))
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request with gzip', async () => {
    const { buffer } = await RequestV2Protocol({
      acks: -1,
      timeout: 30000,
      compression: Types.GZIP,
      topicData: [
        {
          topic: 'test-topic-43395f618a885920238c',
          partitions: [
            {
              partition: 0,
              messages: [
                {
                  key: 'key-d27f2271f5447fe62503',
                  value: 'some-value-e64a333e986853959623',
                  timestamp: 1509928155660,
                },
                {
                  key: 'key-3be6f0b8e6c987d0aedc',
                  value: 'some-value-7259046cfda805b0172e',
                  timestamp: 1509928155660,
                },
                {
                  key: 'key-af98821b43a80d6aa4e8',
                  value: 'some-value-94b9e769ec3e401bfd57',
                  timestamp: 1509928155660,
                },
              ],
            },
          ],
        },
      ],
    }).encode()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require(`../fixtures/v2_request_gzip_${osType}.json`)))
  })
})
