// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NETWORK_DE... Remove this comment to see the full error message
const NETWORK_DELAY = 5000

/**
 * @see https://github.com/apache/kafka/pull/5203
 * The JOIN_GROUP request may block up to sessionTimeout (or rebalanceTimeout in JoinGroupV1),
 * so we should override the requestTimeout to be a bit more than the sessionTimeout
 * NOTE: the sessionTimeout can be configured as Number.MAX_SAFE_INTEGER and overflow when
 * increased, so we have to check for potential overflows
 **/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestTim... Remove this comment to see the full error message
const requestTimeout = ({
  rebalanceTimeout,
  sessionTimeout
}: any) => {
  const timeout = rebalanceTimeout || sessionTimeout
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'isSafeInteger' does not exist on type 'N... Remove this comment to see the full error message
  return Number.isSafeInteger(timeout + NETWORK_DELAY) ? timeout + NETWORK_DELAY : timeout
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'logRespons... Remove this comment to see the full error message
const logResponseError = (memberId: any) => memberId != null && memberId !== ''

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'versions'.
const versions = {
  0: ({
    groupId,
    sessionTimeout,
    memberId,
    protocolType,
    groupProtocols
  }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v0/request')
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v0/response')

    return {
      request: request({
        groupId,
        sessionTimeout,
        memberId,
        protocolType,
        groupProtocols,
      }),
      response,
      requestTimeout: requestTimeout({ rebalanceTimeout: null, sessionTimeout }),
    }
  },
  1: ({
    groupId,
    sessionTimeout,
    rebalanceTimeout,
    memberId,
    protocolType,
    groupProtocols
  }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v1/request')
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v1/response')

    return {
      request: request({
        groupId,
        sessionTimeout,
        rebalanceTimeout,
        memberId,
        protocolType,
        groupProtocols,
      }),
      response,
      requestTimeout: requestTimeout({ rebalanceTimeout, sessionTimeout }),
    }
  },
  2: ({
    groupId,
    sessionTimeout,
    rebalanceTimeout,
    memberId,
    protocolType,
    groupProtocols
  }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v2/request')
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v2/response')

    return {
      request: request({
        groupId,
        sessionTimeout,
        rebalanceTimeout,
        memberId,
        protocolType,
        groupProtocols,
      }),
      response,
      requestTimeout: requestTimeout({ rebalanceTimeout, sessionTimeout }),
    }
  },
  3: ({
    groupId,
    sessionTimeout,
    rebalanceTimeout,
    memberId,
    protocolType,
    groupProtocols
  }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v3/request')
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v3/response')

    return {
      request: request({
        groupId,
        sessionTimeout,
        rebalanceTimeout,
        memberId,
        protocolType,
        groupProtocols,
      }),
      response,
      requestTimeout: requestTimeout({ rebalanceTimeout, sessionTimeout }),
    }
  },
  4: ({
    groupId,
    sessionTimeout,
    rebalanceTimeout,
    memberId,
    protocolType,
    groupProtocols
  }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v4/request')
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v4/response')

    return {
      request: request({
        groupId,
        sessionTimeout,
        rebalanceTimeout,
        memberId,
        protocolType,
        groupProtocols,
      }),
      response,
      requestTimeout: requestTimeout({ rebalanceTimeout, sessionTimeout }),
      // @ts-expect-error ts-migrate(2349) FIXME: This expression is not callable.
      logResponseError: logResponseError(memberId),
    }
  },
  5: ({
    groupId,
    sessionTimeout,
    rebalanceTimeout,
    memberId,
    groupInstanceId,
    protocolType,
    groupProtocols
  }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v5/request')
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v5/response')

    return {
      request: request({
        groupId,
        sessionTimeout,
        rebalanceTimeout,
        memberId,
        groupInstanceId,
        protocolType,
        groupProtocols,
      }),
      response,
      requestTimeout: requestTimeout({ rebalanceTimeout, sessionTimeout }),
      // @ts-expect-error ts-migrate(2349) FIXME: This expression is not callable.
      logResponseError: logResponseError(memberId),
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
