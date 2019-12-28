import * as SerialPort from 'serialport';
import { Stream } from 'stream';
import PQueue from 'p-queue';
import { CommandPacket, CommandGenerator } from './command-generator';
import { responsePacketFromBuffer, splitRawBuffer, ResponsePacket } from './response-packet';
import { Servo } from './types';
import { range } from './utils';

const checkResponseIsOk = true;
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

  static wait = (t: number) => new Promise(ok => setTimeout(ok, t));

  private readonly servos: Map<number, Servo>;
  private readonly queue: PQueue;

  private constructor(
    private readonly port: SerialPort
  ) {
    super();

    if (!checkResponseIsOk) {
      console.log(`Response packet integrity will not be checked! This might lead to corrupt Servo data!`);
    }

    this.servos = new Map();
    this.queue = new PQueue({ concurrency: 1 });

    // let count = 0;
    this.queue.on('active', () => {
      // console.log(`Working on item #${++count}.  Size: ${this.queue.size}  Pending: ${this.queue.pending}`);
    });

    this.port.on('data', (rawBuffer: Buffer) =>
      splitRawBuffer(rawBuffer)
        .map(responsePacketFromBuffer)
        .filter(response => !checkResponseIsOk || response.ok)
        .forEach((response, i) => {
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

  async scan(start = 0x01, end = 0xFF): Promise<unknown[]> {
    return this.sendCommands(...range(start, end).map(id =>
      CommandGenerator.getId(id)
    ));
  }


  servoState(): { [id: number]: Servo } {
    return [...this.servos.entries()].reduce(
      (accum, [k, servo]) => ({ ...accum, [k]: { ...servo }}),
      { }
    );
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

  sendCommands(...commandPackets: CommandPacket[]) {
    const wait = () => new Promise(ok => setTimeout(ok, 1));

    return this.queue.addAll(
      commandPackets.map((commandPacket, i) =>
        () => new Promise(async (ok, err) => {

          // console.log(`writing command packet index ${i} of length ${commandPacket.length}`);
          await wait();

          const sent = this.port.write(commandPacket, (error, bytesWritten) => {
            if (error) {
              console.error('Error writing to port: ', error);
              err(error);
            }
            else ok(bytesWritten);
          });

          if (!sent) err(new Error(`Command not sent! ${commandPacket.toString()}`));
        })
      )
    );
  }
}
