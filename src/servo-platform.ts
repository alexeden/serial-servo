import * as SerialPort from 'serialport';
import { CommandPacket } from './command-generator';

export class ServoPlatform {
  static async ofPath(path: string) {
    const portOpts: SerialPort.OpenOptions = {
      baudRate: 115200,
    };

    return new Promise((ok, err) => {
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
    readonly port: SerialPort
  ) { }

  get isOpen() {
    return this.port.isOpen;
  }

  sendCommand(id: number, commandPacket: CommandPacket) {
    return new Promise((ok, err) =>
      this.port.write(commandPacket, (error, bytesWritten) => {
        if (error) {
          console.error('Write error: ', error);
          err(error);
        }
        else {
          console.log(`${bytesWritten} bytes written to port`);
          ok(bytesWritten);
        }
      })
    );
  }
}
