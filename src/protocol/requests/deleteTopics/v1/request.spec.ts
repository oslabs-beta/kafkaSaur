// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV1P... Remove this comment to see the full error message
const RequestV1Protocol = require('./request')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > DeleteTopics > v1', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const { buffer } = await RequestV1Protocol({
      topics: [
        'test-topic-386ea404396d663a8042-56298-e6e26331-de25-48d8-90b6-4710cd0b618b',
        'test-topic-bb5d4c0c37ae53eb8b53-56298-ac202bf8-78e7-4d8b-ad07-4e01d8148db0',
      ],
      timeout: 5000,
    }).encode()

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v1_request.json')))
  })
})
