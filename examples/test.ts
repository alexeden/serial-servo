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

  console.log(platform.sendCommand(CommandGenerator.getAngle(1)));
  console.log(platform.sendCommand(CommandGenerator.getAngle(2)));
  console.log(await platform.sendCommand(CommandGenerator.getAngle(3)));
  console.log(await platform.sendCommand(CommandGenerator.getAngle(4)));
  console.log(await platform.sendCommand(CommandGenerator.getAngle(5)));
  console.log(await platform.sendCommand(CommandGenerator.getAngle(6)));
})();
