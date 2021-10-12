import requestV0 from '../v0/request.ts'

export default ({
  mechanism
}: any) => ({ ...requestV0({ mechanism }), apiVersion: 1 })
