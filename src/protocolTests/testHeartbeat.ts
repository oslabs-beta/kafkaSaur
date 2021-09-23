/** @format */

/** @format */

/** @format */

import { Encoder } from '../protocol/encoder.js';
import request from '../protocol/request.js';
import { readAll, writeAll } from 'https://deno.land/std@0.105.0/io/util.ts';
import { Decoder } from '../protocol/decoder.js';
import MessageSetDecoder from '../protocol/messageSet/decoder.js';
import { Buffer } from 'https://deno.land/std@0.76.0/node/buffer.ts';

//TYPE IMPORTS!!!!

//STEP 0 - FIND THE MESSAGE FORMATS

/**
 * Heartbeat Request (Version: 0) => group_id group_generation_id member_id
 *   group_id => STRING
 *   group_generation_id => INT32
 *   member_id => STRING
 */

/**
 * Heartbeat Response (Version: 0) => error_code
 *   error_code => INT16
 */

//step 1 - initiate connection

//step 2 - encode according to request message protocol - look in protocol/[message]/[version]/request.js!!

//step 3 - create request

//step 4 - send request

//step 5 - get response

//step 6 - decode according to response message protocol - look in protocol/[message]/[version]/response.js!!

//RESPONSE
