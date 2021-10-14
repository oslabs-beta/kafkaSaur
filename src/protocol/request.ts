/** @format */
// deno-lint-ignore-file no-explicit-any
import { Encoder }  from './encoder.ts';

export default async ({
  correlationId,
  clientId,
  request: { apiKey, apiVersion, encode },
}: {correlationId: number; clientId: string; request: Record<string, any>}) => {
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
