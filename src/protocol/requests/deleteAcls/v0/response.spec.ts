// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const { decode, parse } = require('./response')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > DeleteAcls > v0', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('response', async () => {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const data = await decode(Buffer.from(require('../fixtures/v0_response.json')))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(data).toEqual({
      throttleTime: 0,
      filterResponses: [
        {
          errorCode: 0,
          errorMessage: null,
          matchingAcls: [
            {
              errorCode: 0,
              errorMessage: null,
              resourceType: 2,
              resourceName:
                'test-topic-78d599e9d78a4da685ae-21381-e8f39f07-7d19-4677-aecb-bd0f731f1e28',
              principal: 'User:bob-cd8856cf4f23fe19899c-21381-c20b6340-b95c-431d-9237-2f15e310fba7',
              host: '*',
              operation: 2,
              permissionType: 3,
            },
          ],
        },
      ],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(parse(data)).resolves.toBeTruthy()
  })
})
