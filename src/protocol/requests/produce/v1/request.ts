import requestV0 from '../v0/request.ts'

// Produce Request on or after v1 indicates the client can parse the quota throttle time
// in the Produce Response.

export default ({
  acks,
  timeout,
  topicData
}: any) => {
  return Object.assign(requestV0({ acks, timeout, topicData }), { apiVersion: 1 })
}
