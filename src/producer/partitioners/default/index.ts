import murmur2 from './murmur2.ts'
import createDefaultPartitioner from './partitioner.ts'

export default createDefaultPartitioner(murmur2)
