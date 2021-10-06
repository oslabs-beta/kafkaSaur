/** @format */
import firstRequest from './firstMessage/request.ts';
import firstResponse from './firstMessage/response.ts';
import finalRequest from './finalMessage/request.ts';
import finalResponse from './finalMessage/response.ts';

export default {
  firstMessage: {
    request: firstRequest,
    response: firstResponse,
  },
  finalMessage: {
    request: finalRequest,
    response: finalResponse,
  },
};
