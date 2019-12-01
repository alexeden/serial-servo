import { Response, responseDataLength } from './constants';
import { Servo } from './types';

export type ResponsePacket<C extends Response> = {
  ok: boolean;
  buffer: Buffer;
  id: number;
  command: C;
  length: number;
  paramBytes: Buffer;
  data: ResponsePacketData<C>;
};

export type ResponsePacketData<C extends Response>
  = C extends Response.ServoMoveTimeRead
  ? Pick<Servo, 'id' | 'moveTime'>
  : C extends Response.ServoMoveTimeWaitRead
  ? Pick<Servo, 'id' | 'moveWaitTime' | 'targetAngle'>
  : C extends Response.ServoIdRead
  ? Pick<Servo, 'id'>
  : C extends Response.ServoAngleOffsetRead
  ? Pick<Servo, 'id' | 'offsetAngle'>
  : C extends Response.ServoAngleLimitRead
  ? Pick<Servo, 'id' | 'maxAngle' | 'minAngle'>
  : C extends Response.ServoVinLimitRead
  ? Pick<Servo, 'id' | 'maxVolts' | 'volts'>
  : C extends Response.ServoTempMaxLimitRead
  ? Pick<Servo, 'id' | 'maxTemp'>
  : C extends Response.ServoTempRead
  ? Pick<Servo, 'id' | 'temp'>
  : C extends Response.ServoVinRead
  ? Pick<Servo, 'id' | 'volts'>
  : C extends Response.ServoPosRead
  ? Pick<Servo, 'id' | 'angle'>
  : C extends Response.ServoOrMotorModeRead
  ? Pick<Servo, 'id' | 'motorMode' | 'rotationSpeed'>
  : C extends Response.ServoLoadOrUnloadRead
  ? Pick<Servo, 'id' | 'motorOn'>
  : C extends Response.ServoLedCtrlRead
  ? Pick<Servo, 'id' | 'ledOn'>
  : C extends Response.ServoLedErrorRead
  ? Pick<Servo, 'id' | 'ledAlarms'>
  : never;

const extractResponseData = <C extends Response>(command: C, id: number, paramBytes: Buffer): ResponsePacketData<C> => {

};

export const responsePacketFromBuffer = <C extends Response>(rawBuffer: Buffer): ResponsePacket<C> => {
  const buffer = Buffer.from(rawBuffer);
  const id = buffer[2];
  const length = buffer[3];
  const command = buffer[4] as C;
  const paramBytes = buffer.subarray(4, 4 + length - 3);
  const checksum = buffer[buffer.length - 1];
  // console.log(`checksum: `, checksum);
  const compedChecksum = 0xFF & ~(id + length + command + paramBytes.reduce((sum, b) => sum + b, 0));
  // console.log(`computed checksum: `, compedChecksum);

  return {
    ok: [
      length === responseDataLength(command),
      paramBytes.length === length - 3,
      compedChecksum === checksum,
    ].every(condition => condition === true),
    id,
    command,
    length,
    buffer,
    data: extractResponseData(command, id, paramBytes),
    paramBytes,
  };
};
