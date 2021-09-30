import requestV0 from '../v0/request'

// ApiVersions Request after v1 indicates the client can parse throttle_time_ms

export default () => ({ ...requestV0(), apiVersion: 1 })
