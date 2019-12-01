import * as SerialPort from 'serialport';

export class ServoManager {
  static async ofPath(path: string) {

    const portOpts: SerialPort.OpenOptions = {
      autoOpen: false,
      baudRate: 115200,
    };

    return new Promise((ok, err) => {
      const port = new SerialPort(path, portOpts, error => {
        if (error) {
          console.error(`Error opening the port using path "${path}"`, error);
          err(error);
        }
        else {
          ok(new ServoManager(port));
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
}
