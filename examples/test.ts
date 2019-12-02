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
    console.log('SERVO ADDED: ', servo);
  });

  platform.on('servoUpdate', servo => {
    console.log('SERVO UPDATED: ', servo);
  });
  await platform.sendCommand(CommandGenerator.getAngleLimits(1));
  await platform.sendCommand(CommandGenerator.getAngle(1));
  await platform.sendCommand(CommandGenerator.getAngleLimits(2));
  await platform.sendCommand(CommandGenerator.getAngle(2));
  await platform.sendCommand(CommandGenerator.getAngleLimits(3));
  await platform.sendCommand(CommandGenerator.getAngle(3));
  await platform.sendCommand(CommandGenerator.getAngleLimits(4));
  await platform.sendCommand(CommandGenerator.getAngle(4));
  await platform.sendCommand(CommandGenerator.getAngleLimits(5));
  await platform.sendCommand(CommandGenerator.getAngle(5));
  await platform.sendCommand(CommandGenerator.getAngleLimits(6));
  await platform.sendCommand(CommandGenerator.getAngle(6));
})();
