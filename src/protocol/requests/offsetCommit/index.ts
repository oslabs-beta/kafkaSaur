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
const RETENTION_TIME = -1;

const versions: any = {
  0: ({ groupId, topics }: any) => {
    const request = requestV0;
    const response = responseV0;
    return { request: request({ groupId, topics }), response };
  },
  1: ({ groupId, groupGenerationId, memberId, topics }: any) => {
    const request = requestV1;
    const response = responseV1;
    return {
      request: request({ groupId, groupGenerationId, memberId, topics }),
      response,
    };
  },
  2: ({
    groupId,
    groupGenerationId,
    memberId,
    retentionTime = RETENTION_TIME,
    topics,
  }: any) => {
    const request = requestV2;
    const response = responseV2;
    return {
      request: request({
        groupId,
        groupGenerationId,
        memberId,
        retentionTime,
        topics,
      }),
      response,
    };
  },
  3: ({
    groupId,
    groupGenerationId,
    memberId,
    retentionTime = RETENTION_TIME,
    topics,
  }: any) => {
    const request = requestV3;
    const response = responseV3;
    return {
      request: request({
        groupId,
        groupGenerationId,
        memberId,
        retentionTime,
        topics,
      }),
      response,
    };
  },
  4: ({
    groupId,
    groupGenerationId,
    memberId,
    retentionTime = RETENTION_TIME,
    topics,
  }: any) => {
    const request = requestV4;
    const response = responseV4;
    return {
      request: request({
        groupId,
        groupGenerationId,
        memberId,
        retentionTime,
        topics,
      }),
      response,
    };
  },
  5: ({ groupId, groupGenerationId, memberId, topics }: any) => {
    const request = requestV5;
    const response = responseV5;
    return {
      request: request({
        groupId,
        groupGenerationId,
        memberId,
        topics,
      }),
      response,
    };
  },
};

export default {
  versions: Object.keys(versions),
  protocol: ({ version }: any) => versions[version],
};
