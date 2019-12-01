import * as SerialPort from 'serialport';
import { CommandHeader } from './constants';
import { CommandPacket } from './command-generator';

export class ServoPlatform {
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
    this.port.on('data', this.parse.bind(this));

    this.port.on('error', error => {
      console.log('Port error event: ', error.message);
    });
  }

  get isOpen() {
    return this.port.isOpen;
  }

  parse(buffer: Buffer): any {
    const headerIndex = buffer.indexOf(CommandHeader);
    const nextHeaderIndex = buffer.indexOf(CommandHeader, 2);
    if (headerIndex >= 0) {
      const firstPacket = nextHeaderIndex >= 0
        ? buffer.subarray(headerIndex, nextHeaderIndex)
        : buffer.subarray(headerIndex);
      console.log('first packet: ', firstPacket);
    }
    else {
      console.log('bad packet: ', buffer);
    }

    if (nextHeaderIndex >= 0) {
      const nextPacket = buffer.subarray(nextHeaderIndex);
      // console.log('next packet: ', nextPacket);

      return this.parse(nextPacket);
    }
    // console.log('parsing buffer: ', buffer, 'buffer length: ', buffer.length,
    // 'header index: ', headerIndex, 'next header index: ', nextHeaderIndex);
  }

  sendCommand(commandPacket: CommandPacket) {
    return new Promise((ok, err) => {
      const sent = this.port.write(commandPacket);
      // , (error, bytesWritten) => {
      //   if (error) {
      //     console.error('Write error: ', error);
      //     err(error);
      //   }
      //   else {
      //     console.log(`${bytesWritten} bytes written to port`);
      //     ok(bytesWritten);
      //   }
      // });
      console.log('command sent?', sent);

      this.port.drain(error => {
        if (error) {
          console.error('drain error: ', error);
          err(error);
        }
        else {
          console.log(`port drained after write`);
          ok();
        }
      });

    });
  }
}
