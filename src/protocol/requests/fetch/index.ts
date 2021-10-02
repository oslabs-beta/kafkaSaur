/** @format */

import ISOLATION_LEVEL from '../../isolationLevel.ts';

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

import requestV6 from './v6/request.ts';
import responseV6 from './v6/response.ts';

import requestV7 from './v7/request.ts';
import responseV7 from './v7/response.ts';

import requestV8 from './v8/request.ts';
import responseV8 from './v8/response.ts';

import requestV9 from './v9/request.ts';
import responseV9 from './v9/response.ts';

import requestV10 from './v10/request.ts';
import responseV10 from './v10/response.ts';

import requestV11 from './v11/request.ts';
import responseV11 from './v11/response.ts';

// For normal consumers, use -1
const REPLICA_ID = -1;
const NETWORK_DELAY = 100;

/**
 * The FETCH request can block up to maxWaitTime, which can be bigger than the configured
 * request timeout. It's safer to always use the maxWaitTime
 **/
const requestTimeout = (timeout: any) =>
  Number.isSafeInteger(timeout + NETWORK_DELAY)
    ? timeout + NETWORK_DELAY
    : timeout;

const versions: any = {
  0: ({ replicaId = REPLICA_ID, maxWaitTime, minBytes, topics }: any) => {
    const request = requestV0;
    const response = responseV0;
    return {
      request: request({ replicaId, maxWaitTime, minBytes, topics }),
      response,
      requestTimeout: requestTimeout(maxWaitTime),
    };
  },
  1: ({ replicaId = REPLICA_ID, maxWaitTime, minBytes, topics }: any) => {
    const request = requestV1;
    const response = responseV1;
    return {
      request: request({ replicaId, maxWaitTime, minBytes, topics }),
      response,
      requestTimeout: requestTimeout(maxWaitTime),
    };
  },
  2: ({ replicaId = REPLICA_ID, maxWaitTime, minBytes, topics }: any) => {
    const request = requestV2;
    const response = responseV2;
    return {
      request: request({ replicaId, maxWaitTime, minBytes, topics }),
      response,
      requestTimeout: requestTimeout(maxWaitTime),
    };
  },
  3: ({
    replicaId = REPLICA_ID,
    maxWaitTime,
    minBytes,
    maxBytes,
    topics,
  }: any) => {
    const request = requestV3;
    const response = responseV3;
    return {
      request: request({ replicaId, maxWaitTime, minBytes, maxBytes, topics }),
      response,
      requestTimeout: requestTimeout(maxWaitTime),
    };
  },
  4: ({
    replicaId = REPLICA_ID,
    isolationLevel = ISOLATION_LEVEL.READ_COMMITTED,
    maxWaitTime,
    minBytes,
    maxBytes,
    topics,
  }: any) => {
    const request = requestV4;
    const response = responseV4;
    return {
      request: request({
        replicaId,
        isolationLevel,
        maxWaitTime,
        minBytes,
        maxBytes,
        topics,
      }),
      response,
      requestTimeout: requestTimeout(maxWaitTime),
    };
  },
  5: ({
    replicaId = REPLICA_ID,
    isolationLevel = ISOLATION_LEVEL.READ_COMMITTED,
    maxWaitTime,
    minBytes,
    maxBytes,
    topics,
  }: any) => {
    const request = requestV5;
    const response = responseV5;
    return {
      request: request({
        replicaId,
        isolationLevel,
        maxWaitTime,
        minBytes,
        maxBytes,
        topics,
      }),
      response,
      requestTimeout: requestTimeout(maxWaitTime),
    };
  },
  6: ({
    replicaId = REPLICA_ID,
    isolationLevel = ISOLATION_LEVEL.READ_COMMITTED,
    maxWaitTime,
    minBytes,
    maxBytes,
    topics,
  }: any) => {
    const request = requestV6;
    const response = responseV6;
    return {
      request: request({
        replicaId,
        isolationLevel,
        maxWaitTime,
        minBytes,
        maxBytes,
        topics,
      }),
      response,
      requestTimeout: requestTimeout(maxWaitTime),
    };
  },
  7: ({
    replicaId = REPLICA_ID,
    isolationLevel = ISOLATION_LEVEL.READ_COMMITTED,
    sessionId = 0,
    sessionEpoch = -1,
    forgottenTopics = [],
    maxWaitTime,
    minBytes,
    maxBytes,
    topics,
  }: any) => {
    const request = requestV7;
    const response = responseV7;
    return {
      request: request({
        replicaId,
        isolationLevel,
        sessionId,
        sessionEpoch,
        forgottenTopics,
        maxWaitTime,
        minBytes,
        maxBytes,
        topics,
      }),
      response,
      requestTimeout: requestTimeout(maxWaitTime),
    };
  },
  8: ({
    replicaId = REPLICA_ID,
    isolationLevel = ISOLATION_LEVEL.READ_COMMITTED,
    sessionId = 0,
    sessionEpoch = -1,
    forgottenTopics = [],
    maxWaitTime,
    minBytes,
    maxBytes,
    topics,
  }: any) => {
    const request = requestV8;
    const response = responseV8;
    return {
      request: request({
        replicaId,
        isolationLevel,
        sessionId,
        sessionEpoch,
        forgottenTopics,
        maxWaitTime,
        minBytes,
        maxBytes,
        topics,
      }),
      response,
      requestTimeout: requestTimeout(maxWaitTime),
    };
  },
  9: ({
    replicaId = REPLICA_ID,
    isolationLevel = ISOLATION_LEVEL.READ_COMMITTED,
    sessionId = 0,
    sessionEpoch = -1,
    forgottenTopics = [],
    maxWaitTime,
    minBytes,
    maxBytes,
    topics,
  }: any) => {
    const request = requestV9;
    const response = responseV9;
    return {
      request: request({
        replicaId,
        isolationLevel,
        sessionId,
        sessionEpoch,
        forgottenTopics,
        maxWaitTime,
        minBytes,
        maxBytes,
        topics,
      }),
      response,
      requestTimeout: requestTimeout(maxWaitTime),
    };
  },
  10: ({
    replicaId = REPLICA_ID,
    isolationLevel = ISOLATION_LEVEL.READ_COMMITTED,
    sessionId = 0,
    sessionEpoch = -1,
    forgottenTopics = [],
    maxWaitTime,
    minBytes,
    maxBytes,
    topics,
  }: any) => {
    const request = requestV10;
    const response = responseV10;
    return {
      request: request({
        replicaId,
        isolationLevel,
        sessionId,
        sessionEpoch,
        forgottenTopics,
        maxWaitTime,
        minBytes,
        maxBytes,
        topics,
      }),
      response,
      requestTimeout: requestTimeout(maxWaitTime),
    };
  },
  11: ({
    replicaId = REPLICA_ID,
    isolationLevel = ISOLATION_LEVEL.READ_COMMITTED,
    sessionId = 0,
    sessionEpoch = -1,
    forgottenTopics = [],
    maxWaitTime,
    minBytes,
    maxBytes,
    topics,
    rackId,
  }: any) => {
    const request = requestV11;
    const response = responseV11;
    return {
      request: request({
        replicaId,
        isolationLevel,
        sessionId,
        sessionEpoch,
        forgottenTopics,
        maxWaitTime,
        minBytes,
        maxBytes,
        topics,
        rackId,
      }),
      response,
      requestTimeout: requestTimeout(maxWaitTime),
    };
  },
};

export default {
  versions: Object.keys(versions),
  protocol: ({ version }: any) => versions[version],
};
