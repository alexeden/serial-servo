import * as SerialPort from 'serialport';

console.log('SerialPort: ', SerialPort);

const portOpts: SerialPort.OpenOptions = {
  // baudRate: 115200,
};

const port = new SerialPort('/dev/serial0', portOpts, error => {
  if (error) {
    console.log('Error opening the port: ', error);
  }
});

const readPosPackage = Buffer.of(
  0x55,
  0x55,
  0x01,
  0x03,
  28,
  0xFF & ~(0x01 + 0x03 + 28)
);

port.on('data', data => {
  console.log('Data:', data);
});

const writeReadPosPackage = () => port.write(readPosPackage, (error, bytesWritten, ...args) => {
  console.log('Error: ', error, 'bytes written: ', bytesWritten, ...args);
  if (error) {
    console.error('Write error: ', error);
  }
  else {
    console.log(`${bytesWritten} bytes written to port`);
  }
});

// Open errors will be emitted as an error event
port.on('error', error => {
  console.log('Error: ', error.message);
});

const wait = (t: number) => new Promise(ok => setTimeout(ok, t));
(async () => {
  console.log(writeReadPosPackage());
  await wait(1000);
  console.log(writeReadPosPackage());
  await wait(1000);
  console.log(writeReadPosPackage());
  await wait(1000);
  console.log(writeReadPosPackage());
  await wait(1000);
  console.log(writeReadPosPackage());
  await wait(1000);
  console.log(writeReadPosPackage());
  await wait(1000);
  console.log(writeReadPosPackage());
  await wait(1000);
  console.log(writeReadPosPackage());
  await wait(1000);
  console.log(writeReadPosPackage());
  await wait(1000);
})();
