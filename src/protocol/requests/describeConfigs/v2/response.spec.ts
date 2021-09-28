// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const { decode, parse } = require('./response')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ConfigReso... Remove this comment to see the full error message
const ConfigResourceTypes = require('../../../configResourceTypes')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DEFAULT_CO... Remove this comment to see the full error message
const { DEFAULT_CONFIG } = require('../../../configSource')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > DescribeConfigs > v2', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('response', async () => {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const data = await decode(Buffer.from(require('../fixtures/v1_response.json')))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(data).toEqual({
      clientSideThrottleTime: 0,
      throttleTime: 0,
      resources: [
        {
          errorCode: 0,
          errorMessage: null,
          resourceType: ConfigResourceTypes.TOPIC,
          resourceName: 'topic-test1',
          configEntries: [
            {
              configName: 'compression.type',
              configValue: 'producer',
              readOnly: false,
              isDefault: true,
              configSource: DEFAULT_CONFIG,
              isSensitive: false,
              configSynonyms: [
                {
                  configName: 'compression.type',
                  configSource: DEFAULT_CONFIG,
                  configValue: 'producer',
                },
              ],
            },
            {
              configName: 'retention.ms',
              configValue: '604800000',
              readOnly: false,
              isDefault: true,
              configSource: DEFAULT_CONFIG,
              isSensitive: false,
              configSynonyms: [],
            },
          ],
        },
      ],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(parse(data)).resolves.toBeTruthy()
  })
})
