/** @format */
import {
  Client,
  Packet,
  Event,
} from 'https://deno.land/x/tcp_socket@0.0.1/mods.ts';
const packet = new Packet();
const packetFromUint8Array = new Packet(new Uint8Array());
const packetFromString = new Packet('Hello');
const packetFromPacket = new Packet(packet);

packet.toString(); // Type of string
packet.toData(); // Type of Uint8Array
packet.length(); // Type of number

packet.append(packetFromString); // Add content to the end of the packet
packet.prepend(packetFromString); // Add content at the beginning of packet
