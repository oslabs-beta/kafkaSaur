const BASE_URL = 'https://kafka.js.org'

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = (path: any, hash: any) => `${BASE_URL}/${path}${hash ? '#' + hash : ''}`
