const BASE_URL = 'https://kafka.js.org'

export default (path: any, hash: any) => `${BASE_URL}/${path}${hash ? '#' + hash : ''}`
