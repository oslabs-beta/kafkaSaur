// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'versions'.
const { versions, protocol } = require('./index')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > Produce', () => {
  (versions as any).forEach((version: any) => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe(`v${version}`, () => {
        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
        test('metadata about the API', () => {
            const { request } = protocol({ version })({});
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(request.expectResponse()).toEqual(true);
        });
    });
});
})
