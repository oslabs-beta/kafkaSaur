/** @format */

import requestV0 from './v0/request.ts';
import responseV0 from './v0/response.ts';

import requestV1 from './v1/request.ts';
import responseV1 from './v1/response.ts';

import requestV2 from './v2/request.ts';
import responseV2 from './v2/response.ts';

import requestV3 from './v3/request.ts';
import responseV3 from './v3/response.ts';

import requestV4 from './v4/request.ts';
import responseV4 from './v4/response.ts';

import requestV5 from './v5/request.ts';
import responseV5 from './v5/response.ts';

const NETWORK_DELAY = 5000;

/**
 * @see https://github.com/apache/kafka/pull/5203
 * The JOIN_GROUP request may block up to sessionTimeout (or rebalanceTimeout in JoinGroupV1),
 * so we should override the requestTimeout to be a bit more than the sessionTimeout
 * NOTE: the sessionTimeout can be configured as Number.MAX_SAFE_INTEGER and overflow when
 * increased, so we have to check for potential overflows
 **/
const requestTimeout = ({ rebalanceTimeout, sessionTimeout }: any) => {
  const timeout = rebalanceTimeout || sessionTimeout;
  return Number.isSafeInteger(timeout + NETWORK_DELAY)
    ? timeout + NETWORK_DELAY
    : timeout;
};

const logResponseError = (memberId: any) => memberId != null && memberId !== '';

const versions: any = {
  0: ({
    groupId,
    sessionTimeout,
    memberId,
    protocolType,
    groupProtocols,
  }: any) => {
    const request = requestV0;
    const response = responseV0;

    return {
      request: request({
        groupId,
        sessionTimeout,
        memberId,
        protocolType,
        groupProtocols,
      }),
      response,
      requestTimeout: requestTimeout({
        rebalanceTimeout: null,
        sessionTimeout,
      }),
    };
  },
  1: ({
    groupId,
    sessionTimeout,
    rebalanceTimeout,
    memberId,
    protocolType,
    groupProtocols,
  }: any) => {
    const request = requestV1;
    const response = responseV1;

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
    };
  },
  2: ({
    groupId,
    sessionTimeout,
    rebalanceTimeout,
    memberId,
    protocolType,
    groupProtocols,
  }: any) => {
    const request = requestV2;
    const response = responseV2;

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
    };
  },
  3: ({
    groupId,
    sessionTimeout,
    rebalanceTimeout,
    memberId,
    protocolType,
    groupProtocols,
  }: any) => {
    const request = requestV3;
    const response = responseV3;

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
    };
  },
  4: ({
    groupId,
    sessionTimeout,
    rebalanceTimeout,
    memberId,
    protocolType,
    groupProtocols,
  }: any) => {
    const request = requestV4;
    const response = responseV4;

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
      logResponseError: logResponseError(memberId),
    };
  },
  5: ({
    groupId,
    sessionTimeout,
    rebalanceTimeout,
    memberId,
    groupInstanceId,
    protocolType,
    groupProtocols,
  }: any) => {
    const request = requestV5;
    const response = responseV5;

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
      logResponseError: logResponseError(memberId),
    };
  },
};

export default {
  versions: Object.keys(versions),
  protocol: ({ version }: any) => versions[version],
};
