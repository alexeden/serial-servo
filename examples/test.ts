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
  await platform.sendCommand(CommandGenerator.setTargetAngleAndTime(0xFE, 1000, 20000));
  // await platform.sendCommand(CommandGenerator.setTargetAngleAndTime(3, 0, 0));
  // await wait(2000);
  for (const id of [...Array(6).keys()].map(k => k + 1)) {
    // await platform.sendCommand(CommandGenerator.getId(id));
    // await platform.sendCommand(CommandGenerator.getAngleLimits(id));
    await platform.sendCommand(CommandGenerator.getPosition(id));
    // await platform.sendCommand(CommandGenerator.getLedIsOn(id));
    // await platform.sendCommand(CommandGenerator.getLedAlarms(id));
    // await platform.sendCommand(CommandGenerator.getVoltage(id));
    // await platform.sendCommand(CommandGenerator.getAngleOffset(id));
    await platform.sendCommand(CommandGenerator.getTemp(id));
    // await platform.sendCommand(CommandGenerator.getTempLimit(id));
    // await platform.sendCommand(CommandGenerator.getVoltageLimit(id));
    await platform.sendCommand(CommandGenerator.getTargetAngleAndTime(id));
    // await platform.sendCommand(CommandGenerator.getMotorIsOn(id));
    // await platform.sendCommand(CommandGenerator.getMotorMode(id));
    console.log(`sent all read commands to servo ${id}`);
  }

  console.log(platform.servoState());
})();
