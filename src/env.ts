/** @format */
import process from 'https://deno.land/std@0.110.0/node/process.ts';

export default () => ({
  KAFKAJS_DEBUG_PROTOCOL_BUFFERS: process.env.KAFKAJS_DEBUG_PROTOCOL_BUFFERS,
  KAFKAJS_DEBUG_EXTENDED_PROTOCOL_BUFFERS:
    process.env.KAFKAJS_DEBUG_EXTENDED_PROTOCOL_BUFFERS,
});
