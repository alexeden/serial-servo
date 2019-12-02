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

  /** ServoMoveTimeWrite */

  /** ServoMoveTimeRead */
  static getTargetAngleAndTime(id: number) {
    return CommandGenerator.generate(Command.ServoMoveTimeRead, id);
  }

  /** ServoMoveTimeWaitWrite */

  /** ServoMoveTimeWaitRead */
  static getPresetTargetAngleAndTime(id: number) {
    return CommandGenerator.generate(Command.ServoMoveTimeWaitRead, id);
  }

  /** ServoMoveStart */

  /** ServoMoveStop */

  /** ServoIdWrite */

  /** ServoIdRead */

  /** ServoAngleOffsetAdjust */

  /** ServoAngleOffsetWrite */

  /** ServoAngleOffsetRead */
  static getAngleOffset(id: number) {
    return CommandGenerator.generate(Command.ServoAngleOffsetRead, id);
  }

  /** ServoAngleLimitWrite */

  /** ServoAngleLimitRead */
  static getAngleLimits(id: number) {
    return CommandGenerator.generate(Command.ServoAngleLimitRead, id);
  }

  /** ServoVinLimitWrite */

  /** ServoVinLimitRead */
  static getVoltageLimit(id: number) {
    return CommandGenerator.generate(Command.ServoVinLimitRead, id);
  }

  /** ServoTempMaxLimitWrite */

  /** ServoTempMaxLimitRead */
  static getTempLimit(id: number) {
    return CommandGenerator.generate(Command.ServoTempMaxLimitRead, id);
  }

  /** ServoTempRead */
  static getTemp(id: number) {
    return CommandGenerator.generate(Command.ServoTempRead, id);
  }

  /** ServoVinRead */
  static getVoltage(id: number) {
    return CommandGenerator.generate(Command.ServoVinRead, id);
  }

  /** ServoPosRead */
  static getPosition(id: number) {
    return CommandGenerator.generate(Command.ServoPosRead, id);
  }

  /** ServoOrMotorModeWrite */

  /** ServoOrMotorModeRead */

  /** ServoLoadOrUnloadWrite */

  /** ServoLoadOrUnloadRead */

  /** ServoLedCtrlWrite */

  /** ServoLedCtrlRead */

  /** ServoLedErrorWrite */

  /** ServoLedErrorRead */



}
