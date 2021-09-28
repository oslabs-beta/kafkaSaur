// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const { decode, parse } = require('./response')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > Metadata > v5', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('response', async () => {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const data = await decode(Buffer.from(require('../fixtures/v5_response.json')))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(data).toEqual({
      throttleTime: 0,
      brokers: [
        {
          nodeId: 2,
          host: '10.3.220.89',
          port: 9098,
          rack: null,
        },
        {
          nodeId: 1,
          host: '10.3.220.89',
          port: 9095,
          rack: null,
        },
        {
          nodeId: 0,
          host: '10.3.220.89',
          port: 9092,
          rack: null,
        },
      ],
      clusterId: 'wyOEk0m7Tn-08oGZjtVgEg',
      controllerId: 2,
      topicMetadata: [
        {
          topicErrorCode: 0,
          topic: 'test-topic-f5e17a86896ebfdeb429-80829-a37b6dde-1adc-4687-813d-52d75a0a0f78',
          isInternal: false,
          partitionMetadata: [
            {
              partitionErrorCode: 0,
              partitionId: 0,
              leader: 0,
              replicas: [0],
              isr: [0],
              offlineReplicas: [],
            },
          ],
        },
      ],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(parse(data)).resolves.toBeTruthy()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('response with offline replicas', async () => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
    const data = await decode(Buffer.from(require('../fixtures/v5_offline_replicas_response.json')))

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(data).toEqual({
      throttleTime: 0,
      brokers: [
        {
          nodeId: 1,
          host: '10.3.223.121',
          port: 9095,
          rack: null,
        },
        {
          nodeId: 0,
          host: '10.3.223.121',
          port: 9092,
          rack: null,
        },
      ],
      clusterId: 'tDr4DgFsS96sOEZu6e-N-Q',
      controllerId: 1,
      topicMetadata: [
        {
          topicErrorCode: 0,
          topic: 'topic-test',
          isInternal: false,
          partitionMetadata: [
            {
              isr: [],
              leader: -1,
              offlineReplicas: [2],
              partitionErrorCode: 5,
              partitionId: 2,
              replicas: [2],
            },
            {
              isr: [],
              leader: -1,
              offlineReplicas: [2],
              partitionErrorCode: 5,
              partitionId: 5,
              replicas: [2],
            },
            {
              isr: [1],
              leader: 1,
              offlineReplicas: [],
              partitionErrorCode: 0,
              partitionId: 4,
              replicas: [1],
            },
            {
              isr: [1],
              leader: 1,
              offlineReplicas: [],
              partitionErrorCode: 0,
              partitionId: 1,
              replicas: [1],
            },
            {
              isr: [0],
              leader: 0,
              offlineReplicas: [],
              partitionErrorCode: 0,
              partitionId: 3,
              replicas: [0],
            },
            {
              isr: [0],
              leader: 0,
              offlineReplicas: [],
              partitionErrorCode: 0,
              partitionId: 0,
              replicas: [0],
            },
          ],
        },
        {
          isInternal: false,
          partitionMetadata: [
            {
              isr: [],
              leader: -1,
              offlineReplicas: [2],
              partitionErrorCode: 5,
              partitionId: 0,
              replicas: [2],
            },
          ],
          topic: 'test-topic-tommy',
          topicErrorCode: 0,
        },
      ],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(parse(data)).rejects.toThrow(
      'There is no leader for this topic-partition as we are in the middle of a leadership election'
    )
  })
})
