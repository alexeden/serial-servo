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

const extractResponseData = (command: Response, id: number, paramBytes: Buffer): Servo => {
  switch (command) {
    case Response.ServoMoveTimeRead: {
      return {
        id,
        targetAngle: paramBytes.readUInt16LE(0),
        moveTime: paramBytes.readUInt16LE(2),
      };
    }
    case Response.ServoMoveTimeWaitRead: {
      return {
        id,
        presetTargetAngle: paramBytes.readUInt16LE(0),
        presetMoveTime: paramBytes.readUInt16LE(2),
      };
    }
    case Response.ServoIdRead: {
      if (id !== paramBytes[0]) throw new Error(`Expected ID to be ${id}, received ${paramBytes[0]}!`);

      return {
        id,
      };
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
        minAngle: paramBytes.readUInt16LE(0),
        maxAngle: paramBytes.readUInt16LE(2),
      };
    }
    case Response.ServoVinLimitRead: {
      return {
        id,
        volts: paramBytes.readUInt16LE(0),
        maxVolts: paramBytes.readUInt16LE(2),
      };
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
        volts: paramBytes.readUInt16LE(0),
      };
    }
    case Response.ServoPosRead: {
      return {
        id,
        angle: paramBytes.readUInt16LE(0),
      };
    }
    case Response.ServoOrMotorModeRead: {
      return {
        id,
        motorMode: paramBytes[0],
        rotationSpeed: paramBytes.readUInt16LE(2),
      };
    }
    case Response.ServoLoadOrUnloadRead: {
      return {
        id,
        motorIsOn: !!paramBytes[0],
      };
    }
    case Response.ServoLedCtrlRead: {
      return {
        id,
        ledIsOn: !paramBytes[0],
      };
    }
    case Response.ServoLedErrorRead: {
      return {
        id,
        ledAlarms: paramBytes[0],
      };
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
  const paramBytes = buffer.subarray(5, 5 + length - 3);
  const checksum = buffer[buffer.length - 1];
  const compedChecksum = 0xFF & ~(id + length + command + paramBytes.reduce((sum, b) => sum + b, 0));
  const ok = [
    typeof Response[command] === 'string',
    length === responseDataLength(command),
    paramBytes.length === length - 3,
    checksum === compedChecksum,
  ].every(condition => condition === true);

  if (checksum !== compedChecksum) {
    throw new Error(`Received a corrupt response packet for ${Response[command]} command!`);
  }

  return {
    id,
    command,
    length,
    buffer,
    paramBytes,
    ok,
    data: extractResponseData(command, id, paramBytes),
  };
};
