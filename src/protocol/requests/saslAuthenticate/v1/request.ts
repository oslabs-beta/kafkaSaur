import requestV0 from '../v0/request.ts'

/**
 * SaslAuthenticate Request (Version: 1) => sasl_auth_bytes
 *   sasl_auth_bytes => BYTES
 */

/**
 * @param {Buffer} authBytes - SASL authentication bytes from client as defined by the SASL mechanism
 */
export default ({
 authBytes
}: any) => Object.assign(requestV0({ authBytes }), { apiVersion: 1 })
