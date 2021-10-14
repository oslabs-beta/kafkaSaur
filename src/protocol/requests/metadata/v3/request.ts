/** @format */

import requestV0 from '../v0/request.ts';

/**
 * Metadata Request (Version: 3) => [topics]
 *   topics => STRING
 */

export default ({ topics }: any) =>
  Object.assign(requestV0({ topics }), { apiVersion: 3 });
