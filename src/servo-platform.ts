import * as SerialPort from 'serialport';
import { Response } from './constants';
import { CommandPacket } from './command-generator';
import { responsePacketFromBuffer, splitRawBuffer } from './command-packet';
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

  private constructor(
    private readonly port: SerialPort
  ) {
    super();

    this.port.on('data', (rawBuffer: Buffer) =>
      splitRawBuffer(rawBuffer).forEach((buffer, i) => {
        const response = responsePacketFromBuffer(buffer);
        console.log(`${Response[response.command]} packet: `, response);
      })
    );

    this.port.on('error', error => {
      console.log('Port error event: ', error.message);
    });
  }

  get isOpen() {
    return this.port.isOpen;
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
