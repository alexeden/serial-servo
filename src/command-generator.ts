import { Command, commandDataLength, Response } from './constants';

export type CommandPacket = Buffer;

export class CommandGenerator {
  static generate(
    command: Command,
    id: number,
    ...paramBytes: number[]
  ): CommandPacket {
    const length = commandDataLength(command);
    const checksum = 0xFF & ~(id + length + command + paramBytes.reduce((sum, b) => sum + b, 0));

    if (paramBytes.length !== length - 3) {
      throw new Error(`${Response[command]} expects ${length} bytes of parameters!`);
    }

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

  /** Command.ServoPosRead */
  static getAngle(id: number) {
    return CommandGenerator.generate(Command.ServoPosRead, id);
  }

  /** Command.ServoAngleLimitRead */
  static getAngleLimits(id: number) {
    return CommandGenerator.generate(Command.ServoAngleLimitRead, id);
  }
}
