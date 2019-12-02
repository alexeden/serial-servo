import { Response, CommandHeader, responseDataLength } from './constants';
import { Servo } from './types';

export type ResponsePacket = {
  ok: boolean;
  buffer: Buffer;
  id: number;
  command: Response;
  length: number;
  paramBytes: Buffer;
  data: Servo;
};

// export type ResponsePacketData<C extends Response>
//   = C extends Response.ServoMoveTimeRead
//   ? Pick<Servo, 'id' | 'moveTime'>
//   : C extends Response.ServoMoveTimeWaitRead
//   ? Pick<Servo, 'id' | 'moveWaitTime' | 'targetAngle'>
//   : C extends Response.ServoIdRead
//   ? Pick<Servo, 'id'>
//   : C extends Response.ServoAngleOffsetRead
//   ? Pick<Servo, 'id' | 'offsetAngle'>
//   : C extends Response.ServoAngleLimitRead
//   ? Pick<Servo, 'id' | 'maxAngle' | 'minAngle'>
//   : C extends Response.ServoVinLimitRead
//   ? Pick<Servo, 'id' | 'maxVolts' | 'volts'>
//   : C extends Response.ServoTempMaxLimitRead
//   ? Pick<Servo, 'id' | 'maxTemp'>
//   : C extends Response.ServoTempRead
//   ? Pick<Servo, 'id' | 'temp'>
//   : C extends Response.ServoVinRead
//   ? Pick<Servo, 'id' | 'volts'>
//   : C extends Response.ServoPosRead
//   ? Pick<Servo, 'id' | 'angle'>
//   : C extends Response.ServoOrMotorModeRead
//   ? Pick<Servo, 'id' | 'motorMode' | 'rotationSpeed'>
//   : C extends Response.ServoLoadOrUnloadRead
//   ? Pick<Servo, 'id' | 'motorOn'>
//   : C extends Response.ServoLedCtrlRead
//   ? Pick<Servo, 'id' | 'ledOn'>
//   : C extends Response.ServoLedErrorRead
//   ? Pick<Servo, 'id' | 'ledAlarms'>
//   : never;

const extractResponseData = (command: Response, id: number, paramBytes: Buffer): Servo => {
  switch (command) {
    case Response.ServoMoveTimeRead: {
      return { id, moveTime: 0 };
    }
    case Response.ServoMoveTimeWaitRead: {
      return { id };
    }
    case Response.ServoIdRead: {
      return { id };
    }
    case Response.ServoAngleOffsetRead: {
      return {
        id,
        offsetAngle: paramBytes.readInt8(0),
      };
    }
    case Response.ServoAngleLimitRead: {
      return {
        id,
        minAngle: paramBytes.readInt16BE(0),
        maxAngle: paramBytes.readInt16BE(2),
        // minAngle: paramBytes.readInt16BE(0),
        // maxAngle: paramBytes.readInt16BE(2),
      };
    }
    case Response.ServoVinLimitRead: {
      return { id };
    }
    case Response.ServoTempMaxLimitRead: {
      return {
        id,
        maxTemp: paramBytes.readUInt8(0),
      };
    }
    case Response.ServoTempRead: {
      return {
        id,
        temp: paramBytes.readUInt8(0),
      };
    }
    case Response.ServoVinRead: {
      return {
        id,
        volts: paramBytes.readUInt16BE(0),
      };
    }
    case Response.ServoPosRead: {
      return {
        id,
        angle: paramBytes.readInt16BE(0),
      };
    }
    case Response.ServoOrMotorModeRead: {
      return { id };
    }
    case Response.ServoLoadOrUnloadRead: {
      return { id };
    }
    case Response.ServoLedCtrlRead: {
      return { id };
    }
    case Response.ServoLedErrorRead: {
      return { id };
    }
  }
};

/**
 * Receives the raw buffer received from a serial port and splits it
 * into zero or more buffers copies that are safe to parse as packets.
 */
export const splitRawBuffer = (buffer: Buffer): Buffer[] => {
  const headerIndex = buffer.indexOf(CommandHeader);
  const nextHeaderIndex = buffer.indexOf(CommandHeader, 2);
  if (headerIndex >= 0) {
    const firstBuffer = nextHeaderIndex >= 0
      ? buffer.subarray(headerIndex, nextHeaderIndex)
      : buffer.subarray(headerIndex);

    return [
      Buffer.from(firstBuffer),
      ...(nextHeaderIndex >= 0 ? splitRawBuffer(buffer.subarray(nextHeaderIndex)) : []),
    ];
  }
  else {
    return [];
  }
};

export const responsePacketFromBuffer = (rawBuffer: Buffer): ResponsePacket => {
  const buffer = Buffer.from(rawBuffer);
  const id = buffer[2];
  const length = buffer[3];
  const command = buffer[4];
  const paramBytes = buffer.subarray(4, 4 + length - 3);
  // const checksum = buffer[buffer.length - 1];
  // const compedChecksum = 0xFF & ~(id + length + command + paramBytes.reduce((sum, b) => sum + b, 0));

  return {
    id,
    command,
    length,
    buffer,
    paramBytes,
    ok: [
      typeof Response[command] === 'string',
      length === responseDataLength(command),
      paramBytes.length === length - 3,
    ].every(condition => condition === true),
    data: extractResponseData(command, id, paramBytes),
  };
};
