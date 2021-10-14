// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'response'.
const response = require('./response')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > DeleteRecords > v0', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('response - success', async () => {
    const { decode, parse } = response({})
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const data = await decode(Buffer.from(require('../fixtures/v0_response.json')))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(data).toEqual({
      throttleTime: 0,
      topics: [
        {
          topic: 'test-topic-5da683fa3b1898223498-97119-d06829e3-35d2-4b97-b4b4-7c03d4ad7cc8',
          partitions: [
            {
              partition: 0,
              // @ts-expect-error ts-migrate(2737) FIXME: BigInt literals are not available when targeting l... Remove this comment to see the full error message
              lowWatermark: 7n,
              errorCode: 0,
            },
          ],
        },
      ],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(parse(data)).resolves.toBeTruthy()
  })
})
