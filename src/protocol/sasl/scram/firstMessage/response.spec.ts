// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
import { decode, parse } from './response'

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > sasl > scram > firstMessage', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('response', async () => {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const data = await decode(Buffer.from(require('./fixtures/response.json')))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(parse(data)).resolves.toEqual({
      original:
        'r=IQi00EZwusKw0Io7FoBfqg1c7im78cnh566cwt0watlspw4p,s=bHcyM3p5bWk5aXF4OWM3cmswZHM5N2w0cA==,i=8192',
      r: 'IQi00EZwusKw0Io7FoBfqg1c7im78cnh566cwt0watlspw4p',
      s: 'bHcyM3p5bWk5aXF4OWM3cmswZHM5N2w0cA==',
      i: '8192',
    })
  })
})
