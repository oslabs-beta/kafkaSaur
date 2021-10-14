/** @format */

import { Decoder } from '../../../decoder.ts';

import { failure, createErrorFromCode } from '../../../error.ts';

/**
 * CreateAcls Response (Version: 0) => throttle_time_ms [creation_responses]
 *   throttle_time_ms => INT32
 *   creation_responses => error_code error_message
 *     error_code => INT16
 *     error_message => NULLABLE_STRING
 */

const decodeCreationResponse = (decoder: any) => ({
  errorCode: decoder.readInt16(),
  errorMessage: decoder.readString(),
});
//deno-lint-ignore require-await
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData);
  const throttleTime = decoder.readInt32();
  const creationResponses = decoder.readArray(decodeCreationResponse);

  return {
    throttleTime,
    creationResponses,
  };
};
//deno-lint-ignore require-await
const parse = async (data: any) => {
  const creationResponsesWithError = data.creationResponses.filter(
    ({ errorCode }: any) => failure(errorCode)
  );

  if (creationResponsesWithError.length > 0) {
    throw createErrorFromCode(creationResponsesWithError[0].errorCode);
  }

  return data;
};

export default { decode, parse };
