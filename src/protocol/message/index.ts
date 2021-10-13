import v0 from './v0/index.ts'
import v1 from './v1/index.ts'

const versions: Record<number, any> = {
  0: v0,
  1: v1,
}

export default ({ version = 0 }) => versions[version]

//export default versions[0]
