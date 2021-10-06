/** @format */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSSer... Remove this comment to see the full error message
// const { KafkaJSServerDoesNotSupportApiKey } = require('../../errors')
// // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKeys'.
// const apiKeys = require('./apiKeys')
// // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'lookup'.
// const { lookup, requests } = require('./index')

// // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
// describe('Protocol > Requests', () => {
//   // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
//   describe('requests', () => {
//     // @ts-expect-error ts-migrate(2550) FIXME: Property 'entries' does not exist on type 'ObjectC... Remove this comment to see the full error message
//     Object.entries(requests).forEach(([apiName, impls]) => {
//       if (!impls.versions) {
//         return
//       }

//       impls.versions.forEach((version: any) => {
//         // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
//         test(`${apiName} > v${version} > metadata`, () => {
//           const { request } = impls.protocol({ version })({})
//           // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
//           expect(request.apiKey).toEqual(apiKeys[apiName])
//           // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
//           expect(request.apiVersion).toEqual(Number(version))
//           // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
//           expect(request.apiName).toEqual(apiName)
//         })
//       })
//     })
//   })
//   // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
//   describe('lookup', () => {
//     // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
//     describe('when the client support more versions than the server', () => {
//       // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
//       it('returns the maximum version supported by the server', async () => {
//         const apiKey = 1
//         // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
//         const protocol = jest.fn(() => true)

//         // versions supported by the server
//         const versions = { [apiKey]: { minVersion: 0, maxVersion: 1 } }

//         // versions supported by the client
//         const definition = { versions: [0, 1, 2], protocol }

//         // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
//         expect(lookup(versions)(apiKey, definition)).toEqual(true)
//         // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
//         expect(protocol).toHaveBeenCalledWith({ version: 1 })
//       })
//     })

//     // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
//     describe('when the server support more versions than the client', () => {
//       // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
//       it('returns the maximum version supported by the client', () => {
//         const apiKey = 1
//         // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
//         const protocol = jest.fn(() => true)

//         // versions supported by the server
//         const versions = { [apiKey]: { minVersion: 1, maxVersion: 3 } }

//         // versions supported by the client
//         const definition = { versions: [0, 1, 2], protocol }

//         // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
//         expect(lookup(versions)(apiKey, definition)).toEqual(true)
//         // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
//         expect(protocol).toHaveBeenCalledWith({ version: 2 })
//       })
//     })

//     // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
//     describe('when the server does not support the requested version', () => {
//       // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
//       it('throws KafkaJSServerDoesNotSupportApiKey', () => {
//         // versions supported by the server
//         const versions = { 1: { minVersion: 1, maxVersion: 3 } }

//         // versions supported by the client
//         // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
//         const protocol = jest.fn(() => true)
//         const definition = { versions: [0, 1, 2], protocol }

//         const apiKeyNotSupportedByTheServer = 34
//         // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
//         expect(() => lookup(versions)(apiKeyNotSupportedByTheServer, definition)).toThrow(
//           KafkaJSServerDoesNotSupportApiKey
//         )
//       })
//     })
//   })
// })
