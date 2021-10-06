/** @format */

import {Encoder} from '../../../encoder.ts';
import apiKeys from '../../apiKeys.ts';
const apiKey = apiKeys.ApiVersions;

/**
 * ApiVersionRequest => ApiKeys
 */

export default () => ({
  apiKey,
  apiVersion: 0,
  apiName: 'ApiVersions',
  encode: async () => new Encoder(),
});
