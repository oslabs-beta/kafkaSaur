import requestV0 from '../v0/request.ts'

export default ({
  replicaId,
  maxWaitTime,
  minBytes,
  topics
}: any) => {
  return Object.assign(requestV0({ replicaId, maxWaitTime, minBytes, topics }), { apiVersion: 2 })
}
