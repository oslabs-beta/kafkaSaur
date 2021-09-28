// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'versions'.
const versions = {
  1: ({
    groupId,
    topics
  }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v1/request')
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v1/response')
    return { request: request({ groupId, topics }), response }
  },
  2: ({
    groupId,
    topics
  }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v2/request')
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v2/response')
    return { request: request({ groupId, topics }), response }
  },
  3: ({
    groupId,
    topics
  }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v3/request')
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v3/response')
    return { request: request({ groupId, topics }), response }
  },
  4: ({
    groupId,
    topics
  }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v4/request')
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v4/response')
    return { request: request({ groupId, topics }), response }
  },
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  versions: Object.keys(versions),
  protocol: ({
    version
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  }: any) => versions[version],
}
