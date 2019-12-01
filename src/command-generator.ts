import { Command, commandDataLength } from './constants';

export type CommandPacket = Buffer;

export class CommandGenerator {
  static generate(
    command: Command,
    id: number,
    ...paramBytes: number[]
  ): CommandPacket {
    const length = commandDataLength(command);
    const checksum = 0xFF & ~(id + length + command + paramBytes.reduce((sum, b) => sum + b, 0));

    return Buffer.of(
      0x55,
      0x55,
      id,
      length,
      command,
      ...paramBytes,
      checksum
    );
  }

  static getAngle(id: number) {

  }
}
