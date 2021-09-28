// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RequestV2P... Remove this comment to see the full error message
const RequestV2Protocol = require('./request')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ConfigReso... Remove this comment to see the full error message
const ConfigResourceTypes = require('../../../configResourceTypes')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > DescribeConfigs > v2', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    const { buffer } = await RequestV2Protocol({
      includeSynonyms: true,
      resources: [
        {
          type: ConfigResourceTypes.TOPIC,
          name: 'topic-test1',
          configNames: ['compression.type', 'retention.ms'],
        },
      ],
    }).encode()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v1_request.json')))
  })
})
