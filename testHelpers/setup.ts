/** @format */

// // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
// jest.setTimeout(90000)

// // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
// const retries = process.env.TEST_RETRIES != null ? parseInt(process.env.TEST_RETRIES, 10) : 0
// // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
// jest.retryTimes(retries)

// // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
// require('jest-extended')

// // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
// expect.extend({
//   optional(v: any, value: any) {
//     const pass = typeof v === 'undefined' || v === value
//     return {
//       pass,
//       message: () => `Expected ${value} to ${pass ? 'not ' : ''}be undefined or ${value}`,
//     }
//   },
//   toBeTypeOrNull(received: any, argument: any) {
//     if (received === null)
//       return {
//         message: () => `Ok`,
//         pass: true,
//       }
//     // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
//     if (expect(received).toEqual(expect.any(argument))) {
//       return {
//         message: () => `Ok`,
//         pass: true,
//       }
//     } else {
//       return {
//         message: () => `expected ${received} to be ${argument} type or null`,
//         pass: false,
//       }
//     }
//   },
// })

// // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
// const glob = require('glob')
// // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
// const path = require('path')

// // Protocol files are imported on demand depending on the APIs supported by Kafka,
// // but this behavior doesn't help Jest. Therefore, all files are eagerly imported
// // when running tests
// glob
//   .sync('src/protocol/requests/**/v*/@(request|response).js')
//   .map((file: any) => path.resolve(file))
//   // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
//   .map(require)
