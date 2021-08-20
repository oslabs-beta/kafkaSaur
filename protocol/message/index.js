/** @format */
import { Version0 } from './v0/index.js';
import { Version1 } from './v1/index.js';

const versions = {
  0: Version0,
  1: Version1,
};

export function MessageProtocol({ version = 0 }) {
  versions[version];
}
