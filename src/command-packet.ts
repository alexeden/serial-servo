import { Command } from './constants';

export interface CommandPacket {
  ok: boolean;
  buffer: Buffer;
  command: Command;
  length: number;
}

export const packetFromBuffer = (buffer: Buffer): CommandPacket => {


  return {
    buffer,
  };
};
