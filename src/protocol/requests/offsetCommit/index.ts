// This value signals to the broker that its default configuration should be used.
const RETENTION_TIME = -1

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'versions'.
const versions = {
  0: ({
    groupId,
    topics
  }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v0/request')
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v0/response')
    return { request: request({ groupId, topics }), response }
  },
  1: ({
    groupId,
    groupGenerationId,
    memberId,
    topics
  }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v1/request')
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v1/response')
    return { request: request({ groupId, groupGenerationId, memberId, topics }), response }
  },
  2: ({
    groupId,
    groupGenerationId,
    memberId,
    retentionTime = RETENTION_TIME,
    topics
  }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v2/request')
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v2/response')
    return {
      request: request({
        groupId,
        groupGenerationId,
        memberId,
        retentionTime,
        topics,
      }),
      response,
    }
  },
  3: ({
    groupId,
    groupGenerationId,
    memberId,
    retentionTime = RETENTION_TIME,
    topics
  }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v3/request')
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v3/response')
    return {
      request: request({
        groupId,
        groupGenerationId,
        memberId,
        retentionTime,
        topics,
      }),
      response,
    }
  },
  4: ({
    groupId,
    groupGenerationId,
    memberId,
    retentionTime = RETENTION_TIME,
    topics
  }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v4/request')
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v4/response')
    return {
      request: request({
        groupId,
        groupGenerationId,
        memberId,
        retentionTime,
        topics,
      }),
      response,
    }
  },
  5: ({
    groupId,
    groupGenerationId,
    memberId,
    topics
  }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v5/request')
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v5/response')
    return {
      request: request({
        groupId,
        groupGenerationId,
        memberId,
        topics,
      }),
      response,
    }
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
