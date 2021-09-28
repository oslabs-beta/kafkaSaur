// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const { decode, parse } = require('./response')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > Metadata > v3', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('response', async () => {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const data = await decode(Buffer.from(require('../fixtures/v3_response.json')))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(data).toEqual({
      throttleTime: 0,
      brokers: [
        {
          nodeId: 2,
          host: '192.168.1.173',
          port: 9098,
          rack: null,
        },
        {
          nodeId: 1,
          host: '192.168.1.173',
          port: 9095,
          rack: null,
        },
        {
          nodeId: 0,
          host: '192.168.1.173',
          port: 9092,
          rack: null,
        },
      ],
      clusterId: 'Q0WO3u_TTAeslFDJWiiGvA',
      controllerId: 1,
      topicMetadata: [
        {
          topicErrorCode: 0,
          topic: 'test-topic-0f67c79007c9157fc83d',
          isInternal: false,
          partitionMetadata: [
            {
              partitionErrorCode: 0,
              partitionId: 0,
              leader: 2,
              replicas: [2],
              isr: [2],
            },
          ],
        },
      ],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(parse(data)).resolves.toBeTruthy()
  })
})
