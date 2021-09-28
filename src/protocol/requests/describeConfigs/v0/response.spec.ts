// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const { decode, parse } = require('./response')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ConfigSour... Remove this comment to see the full error message
const ConfigSource = require('../../../configSource')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > DescribeConfigs > v0', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('response', async () => {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const data = await decode(Buffer.from(require('../fixtures/v0_response.json')))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(data).toEqual({
      throttleTime: 0,
      resources: [
        {
          errorCode: 0,
          errorMessage: null,
          resourceType: 2,
          resourceName: 'test-topic-443a0ba6d66fd2161c73',
          configEntries: [
            {
              configName: 'compression.type',
              configValue: 'producer',
              readOnly: false,
              isDefault: true,
              configSource: ConfigSource.DEFAULT_CONFIG,
              isSensitive: false,
            },
            {
              configName: 'retention.ms',
              configValue: '604800000',
              readOnly: false,
              isDefault: true,
              configSource: ConfigSource.DEFAULT_CONFIG,
              isSensitive: false,
            },
          ],
        },
      ],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(parse(data)).resolves.toBeTruthy()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('ConfigSource backporting', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be set to TOPIC_CONFIG when the altered config belongs to a topic resource', async () => {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      const data = await decode(Buffer.from(require('../fixtures/v0_response_topic_config.json')))
      const { configEntries } = data.resources[0]

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(configEntries).toEqual(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.arrayContaining([
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect.objectContaining({
            configName: 'retention.ms',
            isDefault: false,
            configSource: ConfigSource.TOPIC_CONFIG,
          }),
        ])
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be set to STATIC_BROKER_CONFIG when the altered config belongs to a broker resource', async () => {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      const data = await decode(Buffer.from(require('../fixtures/v0_response_broker_config.json')))
      const { configEntries } = data.resources[0]

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(configEntries).toEqual(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.arrayContaining([
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect.objectContaining({
            configName: 'sasl.kerberos.service.name',
            isDefault: false,
            configSource: ConfigSource.STATIC_BROKER_CONFIG,
          }),
        ])
      )
    })
  })
})
