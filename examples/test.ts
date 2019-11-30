import * as SerialPort from 'serialport';

console.log('SerialPort: ', SerialPort);

const portOpts: SerialPort.OpenOptions = {
  baudRate: 115200,
};

const port = new SerialPort('/dev/ttyAMA0', portOpts, error => {
  if (error) {
    console.log('Error opening the port: ', error);
  }
});

// Read data that is available but keep the stream in "paused mode"
port.on('readable', () => {
  console.log('Data:', port.read());
});


// Open errors will be emitted as an error event
port.on('error', error => {
  console.log('Error: ', error.message);
});
