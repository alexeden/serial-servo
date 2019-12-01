import { Response, responseDataLength } from './constants';

export type ResponsePacketBase<C extends Response, D> = D & {
  ok: boolean;
  buffer: Buffer;
  id: number;
  command: C;
  length: number;
  paramBytes: Buffer;
};

export type ResponsePacket
  = ResponsePacketBase<Response.ServoAngleLimitRead, {
      // maxAngle: number;
      // minAngle: number;
    }>;

export const responsePacketFromBuffer = (rawBuffer: Buffer): ResponsePacket => {
  const buffer = Buffer.from(rawBuffer);
  const id = buffer[2];
  const length = buffer[3];
  const command = buffer[4];
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
    paramBytes,
  };
};
