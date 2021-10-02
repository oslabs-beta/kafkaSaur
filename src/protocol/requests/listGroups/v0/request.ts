/** @format */

import Encoder from '../../../encoder.ts';
import apiKeys from '../../apiKeys.ts';
const apiKey = apiKeys.ListGroups;
/**
 * ListGroups Request (Version: 0)
 */

/**
 */
export default () => ({
  apiKey,
  apiVersion: 0,
  apiName: 'ListGroups',
  encode: async () => {
    return new Encoder();
  },
});
