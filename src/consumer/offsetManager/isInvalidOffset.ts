/** @format */

/** @format */ import { Long } from '../../../utils/long.js';

export default (offset: any) =>
  (!offset && offset !== 0) || Long.fromValue(offset).isNegative();
