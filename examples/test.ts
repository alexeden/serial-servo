import * as SerialPort from 'serialport';

const portOpts: SerialPort.OpenOptions = {
  baudRate: 115200,
};

const port = new SerialPort('/dev/ttyAMA0', portOpts, error => {
  if (error) {
    console.log('Error opening the port: ', error);
  }
});

const readPosPackage = Buffer.of(
  0x55,
  0x55,
  0x01,
  0x03,
  0x1c,
  0xFF & ~(0x01 + 0x03 + 0x1c)
);

port.on('data', data => {
  console.log('Data event:', data);
});

const writeReadPosPackage = () => {
  console.log('writing packet');

  return new Promise((ok, err) => {
    port.write(readPosPackage, (error, bytesWritten, ...args) => {
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
};

// Open errors will be emitted as an error event
port.on('error', error => {
  console.log('Port error event: ', error.message);
});

const wait = (t: number) => new Promise(ok => setTimeout(ok, t));
(async () => {
  await writeReadPosPackage();
  await wait(1000);
  await writeReadPosPackage();
  await wait(1000);
  await writeReadPosPackage();
  await wait(1000);
  await writeReadPosPackage();
  await wait(1000);
  await writeReadPosPackage();
  await wait(1000);
  await writeReadPosPackage();
  await wait(1000);
  await writeReadPosPackage();
  await wait(1000);
  await writeReadPosPackage();
  await wait(1000);
  await writeReadPosPackage();
  await wait(1000);
})();
