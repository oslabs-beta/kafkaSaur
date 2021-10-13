
import crc32C from './crc32C.ts'
const unsigned = (value: any) => Uint32Array.from([value])[0]


export default(buffer: any) => unsigned(crc32C(buffer))
