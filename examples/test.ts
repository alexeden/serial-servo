import * as SerialPort from 'serialport';
import { ServoPlatform } from '../src';

console.log(ServoPlatform);

const portOpts: SerialPort.OpenOptions = {
  autoOpen: false,
  baudRate: 115200,
};

const port = new SerialPort('/dev/ttyAMA0', portOpts, error => {
  if (error) {
    console.log('Error opening the port: ', error);
  }
});

const rPosPacket =  (id: number) => Buffer.of(0x55, 0x55, id, 0x03, 0x1c, 0xFF & ~(id + 0x03 + 0x1c));
const readIdPacket =  () => Buffer.of(0x55, 0x55, 0xFE, 0x03, 14, 0xFF & ~(0xFE + 0x03 + 14));

port.on('data', data => {
  console.log('Data event:', data);
});

const writeReadIdPacket = () =>
  new Promise((ok, err) => {
    port.write(readIdPacket(), (error, bytesWritten, ...args) => {
      if (error) {
        console.error('Write error: ', error);
        err(error);
      }
      else {
        console.log(`${bytesWritten} bytes written to port`);
        ok(bytesWritten);
      }
    });
  });


const writeReadPosPackage = (id: number) =>
  new Promise((ok, err) => {
    port.write(rPosPacket(id), (error, bytesWritten, ...args) => {
      if (error) {
        console.error('Write error: ', error);
        err(error);
      }
      else {
        console.log(`${bytesWritten} bytes written to port`);
        ok(bytesWritten);
      }
    });
  });

// Open errors will be emitted as an error event
port.on('error', error => {
  console.log('Port error event: ', error.message);
});

const flush = () => new Promise((ok, err) => {
  port.flush(error => {
    if (error) err(error);
    else ok();
  });
});

const wait = (t: number) => new Promise(ok => setTimeout(ok, t));
(async () => {
  const servoMan = await ServoPlatform.ofPath('/dev/ttyAMA0');
  console.log(servoMan);
  console.log(await SerialPort.list());

  await writeReadIdPacket();
  await flush();
  await wait(1000);
  await writeReadIdPacket();
  await flush();
  await wait(1000);
  await writeReadIdPacket();
  await flush();
  await wait(1000);
  await writeReadIdPacket();
  await flush();
  await wait(1000);
  await writeReadIdPacket();
  await flush();
  await wait(1000);
  await writeReadIdPacket();
  await wait(1000);
  await writeReadPosPackage(1);
  await wait(1000);
  await writeReadPosPackage(2);
  await wait(1000);
  await writeReadPosPackage(3);
  await wait(1000);
  await writeReadPosPackage(4);
  await wait(1000);
  await writeReadPosPackage(5);
  await wait(1000);
  await writeReadPosPackage(7);
  await wait(1000);
  await writeReadPosPackage(6);
  await wait(1000);
})();
