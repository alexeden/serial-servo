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
        targetAngle: paramBytes.readUInt16BE(0),
        moveTime: paramBytes.readUInt16BE(2),
      };
    }
    case Response.ServoMoveTimeWaitRead: {
      return {
        id,
        presetTargetAngle: paramBytes.readUInt16BE(0),
        presetMoveTime: paramBytes.readUInt16BE(2),
      };
    }
    case Response.ServoIdRead: {
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
        minAngle: paramBytes.readInt16BE(0) & 0x3FF,
        maxAngle: paramBytes.readInt16BE(2) & 0x3FF,
      };
    }
    case Response.ServoVinLimitRead: {
      return {
        id,
        volts: paramBytes.readUInt16BE(0),
        maxVolts: paramBytes.readUInt16BE(2),
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
        volts: paramBytes.readUInt16BE(0),
      };
    }
    case Response.ServoPosRead: {
      return {
        id,
        angle: paramBytes.readUInt16BE(0) & 0x3FF,
      };
    }
    case Response.ServoOrMotorModeRead: {
      return {
        id,
        motorMode: paramBytes[0] & 1,
        rotationSpeed: paramBytes.readUInt16BE(2),
      };
    }
    case Response.ServoLoadOrUnloadRead: {
      return {
        id,
        motorIsOn: !!(paramBytes[0] & 1),
      };
    }
    case Response.ServoLedCtrlRead: {
      return {
        id,
        ledIsOn: !(paramBytes[0] & 1),
      };
    }
    case Response.ServoLedErrorRead: {
      return {
        id,
        ledAlarms: paramBytes[0] & 0xF,
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
  const paramBytes = buffer.subarray(4, 4 + length - 3);
  const ok = [
    typeof Response[command] === 'string',
    length === responseDataLength(command),
    paramBytes.length === length - 3,
  ].every(condition => condition === true);

  // if (!ok) {
  //   console.error('Packet is not okay!', buffer);
  //   console.log(`Command exists? ${typeof Response[command] === 'string'}`);
  //   console.log(`Lengths match? ${length === responseDataLength(command)}`);
  //   console.log(`Length byte is ${length}`);
  //   console.log(`Expected ${responseDataLength(command)} bytes`);
  //   console.log(`Param has ${paramBytes.length}  bytes`);
  // }
  // const checksum = buffer[buffer.length - 1];
  // const compedChecksum = 0xFF & ~(id + length + command + paramBytes.reduce((sum, b) => sum + b, 0));

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
