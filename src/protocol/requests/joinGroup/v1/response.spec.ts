// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'unsupporte... Remove this comment to see the full error message
const { unsupportedVersionResponse } = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const { decode, parse } = require('./response')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > JoinGroup > v1', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('response', async () => {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const data = await decode(Buffer.from(require('../fixtures/v1_response.json')))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(data).toEqual({
      errorCode: 0,
      generationId: 1,
      groupProtocol: 'AssignerName',
      leaderId:
        'test-9dfcfa24752a27f51026-21486-91f3d0e3-dc7a-464f-ab89-94cb49a53a62-d9c2c2a5-cb2f-468e-a943-368336a2cd48',
      memberId:
        'test-9dfcfa24752a27f51026-21486-91f3d0e3-dc7a-464f-ab89-94cb49a53a62-d9c2c2a5-cb2f-468e-a943-368336a2cd48',
      members: [
        {
          memberId:
            'test-9dfcfa24752a27f51026-21486-91f3d0e3-dc7a-464f-ab89-94cb49a53a62-d9c2c2a5-cb2f-468e-a943-368336a2cd48',
          // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
          memberMetadata: Buffer.from(require('../fixtures/v1_assignerMetadata.json')),
        },
      ],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(parse(data)).resolves.toBeTruthy()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('throws KafkaJSProtocolError if the api is not supported', async () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(decode(unsupportedVersionResponse())).rejects.toThrow(
      /The version of API is not supported/
    )
  })
})
