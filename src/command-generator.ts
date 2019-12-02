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
  static setTargetAngleAndTime(id: number, targetAngle: number, moveTime: number) {
    const params = Buffer.allocUnsafe(4);
    params.writeUInt16LE(targetAngle, 0);
    params.writeUInt16LE(moveTime, 2);

    return CommandGenerator.generate(Command.ServoMoveTimeWrite, id, ...params);
  }

  /** ServoMoveTimeRead */
  static getTargetAngleAndTime(id: number) {
    return CommandGenerator.generate(Command.ServoMoveTimeRead, id);
  }

  /** ServoMoveTimeWaitWrite */

  /** ServoMoveTimeWaitRead */
  static getPresetTargetAngleAndTime(id: number) {
    throw new Error(`"ServoMoveTimeWaitRead" is not implemented. Currently experiences issues with bad response packets from servos.`);

    return CommandGenerator.generate(Command.ServoMoveTimeWaitRead, id);
  }

  /** ServoMoveStart */

  /** ServoMoveStop */

  /** ServoIdWrite */

  /** ServoIdRead */
  static getId(id: number) {
    return CommandGenerator.generate(Command.ServoIdRead, id);
  }

  /** ServoAngleOffsetAdjust */

  /** ServoAngleOffsetWrite */

  /** ServoAngleOffsetRead */
  static getAngleOffset(id: number) {
    return CommandGenerator.generate(Command.ServoAngleOffsetRead, id);
  }

  /** ServoAngleLimitWrite */
  static setAngleLimits(id: number, { minAngle, maxAngle } = { minAngle: 0, maxAngle: 1000 }) {
    const params = Buffer.allocUnsafe(4);
    params.writeUInt16LE(minAngle, 0);
    params.writeUInt16LE(maxAngle, 2);

    return CommandGenerator.generate(Command.ServoAngleLimitWrite, id, ...params);
  }

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
  static getMotorMode(id: number) {
    return CommandGenerator.generate(Command.ServoOrMotorModeRead, id);
  }

  /** ServoLoadOrUnloadWrite */

  /** ServoLoadOrUnloadRead */
  static getMotorIsOn(id: number) {
    return CommandGenerator.generate(Command.ServoLoadOrUnloadRead, id);
  }

  /** ServoLedCtrlWrite */
  static setLedIsOn(id: number, ledIsOn = true) {
    const params = Buffer.allocUnsafe(1);
    params.writeUInt8(ledIsOn ? 0 : 1, 0);

    return CommandGenerator.generate(Command.ServoLedCtrlWrite, id, ...params);
  }

  /** ServoLedCtrlRead */
  static getLedIsOn(id: number) {
    return CommandGenerator.generate(Command.ServoLedCtrlRead, id);
  }

  /** ServoLedErrorWrite */

  /** ServoLedErrorRead */
  static getLedAlarms(id: number) {
    return CommandGenerator.generate(Command.ServoLedErrorRead, id);
  }
}
