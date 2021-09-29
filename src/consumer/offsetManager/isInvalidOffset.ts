import Long from '../../utils/long.ts'

export default (offset: any) => (!offset && offset !== 0) || Long.fromValue(offset).isNegative()
