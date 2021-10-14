// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV3P... Remove this comment to see the full error message
const RequestV3Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > OffsetFetch > v3', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const groupId =
      'consumer-group-id-d1492d7a3c14a838a28f-20117-ae82781b-863d-4f23-9377-d165ca585f31'

    const topics = [
      {
        topic: 'test-topic-df48241c4bf2fca9d16b-20117-aff9b64c-69a2-4456-be7b-de5bcd78984e',
        partitions: [{ partition: 0 }],
      },
    ]

    const { buffer } = await RequestV3Protocol({ groupId, topics }).encode()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v3_request.json')))
  })
})
