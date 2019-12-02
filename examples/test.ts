import * as SerialPort from 'serialport';
import { ServoPlatform, CommandGenerator } from '../src';

// const flush = () => new Promise((ok, err) => {
//   port.flush(error => {
//     if (error) err(error);
//     else ok();
//   });
// });

const wait = (t: number) => new Promise(ok => setTimeout(ok, t));
(async () => {
  console.log(await SerialPort.list());
  const platform = await ServoPlatform.ofPath('/dev/ttyAMA0');

  platform.on('newServo', servo => {
    // console.log('SERVO ADDED: ', servo);
  });

  platform.on('servoUpdate', servo => {
    // console.log('SERVO UPDATED: ', servo);
  });
  for (const id of [...Array(6).keys()]) {
    await platform.sendCommand(CommandGenerator.getAngleLimits(id));
    await platform.sendCommand(CommandGenerator.getPosition(id));
    await platform.sendCommand(CommandGenerator.getVoltage(id));
    await platform.sendCommand(CommandGenerator.getAngleOffset(id));
    await platform.sendCommand(CommandGenerator.getTemp(id));
    await platform.sendCommand(CommandGenerator.getTempLimit(id));
  }
  console.log(platform.servoState());
})();
