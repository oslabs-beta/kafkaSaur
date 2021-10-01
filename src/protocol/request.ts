/** @format */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
import Encoder from './encoder.ts';

export default async ({
  correlationId,
  clientId,
  request: { apiKey, apiVersion, encode },
}: any) => {
  const payload = await encode();
  const requestPayload = new Encoder()
    .writeInt16(apiKey)
    .writeInt16(apiVersion)
    .writeInt32(correlationId)
    .writeString(clientId)
    .writeEncoder(payload);

  return new Encoder()
    .writeInt32(requestPayload.size())
    .writeEncoder(requestPayload);
};
