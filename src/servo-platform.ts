import * as SerialPort from 'serialport';
import { Response } from './constants';
import { CommandPacket } from './command-generator';
import { responsePacketFromBuffer, splitRawBuffer, ResponsePacket } from './command-packet';
import { Servo } from './types';
import { Stream } from 'stream';

export class ServoPlatform extends Stream {
  static async ofPath(path: string) {
    const portOpts: SerialPort.OpenOptions = {
      baudRate: 115200,
    };

    return new Promise<ServoPlatform>((ok, err) => {
      const port = new SerialPort(path, portOpts, error => {
        if (error) {
          console.error(`Error opening the port using path "${path}"`, error);
          err(error);
        }
        else {
          ok(new ServoPlatform(port));
        }
      });
    });
  }

  private readonly servos: Map<number, Servo>;

  private constructor(
    private readonly port: SerialPort
  ) {
    super();

    this.servos = new Map();

    this.port.on('data', (rawBuffer: Buffer) =>
      splitRawBuffer(rawBuffer)
        .map(responsePacketFromBuffer)
        .filter(response => response.ok)
        .forEach((response, i) => {
          console.log(`${Response[response.command]} packet: `, response);
          this.handleResponse(response);
        })
    );

    this.port.on('error', error => {
      console.log('Port error event: ', error.message);
    });
  }

  get isOpen() {
    return this.port.isOpen;
  }

  handleResponse({ id, data, ...response }: ResponsePacket) {
    if (this.servos.has(id)) {
      const updatedServo: Servo = { id, ...this.servos.get(id), ...data };
      this.servos.set(id, updatedServo);
      this.emit('servoUpdate', updatedServo);
    }
    else {
      const newServo = { id, ...data };
      this.servos.set(id, newServo);
      this.emit('newServo', newServo);
      this.emit('servoUpdate', newServo);
    }
  }

  sendCommand(commandPacket: CommandPacket) {
    return new Promise((ok, err) => {
      const sent = this.port.write(commandPacket);
      console.log('command sent?', sent);

      this.port.drain(error => {
        if (error) {
          console.error('drain error: ', error);
          err(error);
        }
        else ok();
      });
    });
  }
}
