import { Command } from './constants';

export interface CommandPacket {
  ok: boolean;
  buffer: Buffer;
  servoId: number;
  command: Command;
  length: number;
  paramBytes: number[];
}

export const packetFromBuffer = (buffer: Buffer): CommandPacket => {
  const id = buffer[2];

  return {
    buffer,
  };
};
