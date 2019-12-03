import * as SerialPort from 'serialport';
import { ServoPlatform, CommandGenerator } from '../src';
import { MotorMode } from '../src/types';

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
    // console.log('SERVO UPDATED: ', servo);
  });

  await platform.scan();
  // await platform.sendCommands(CommandGenerator.setAngleLimits(0xFE));
  // await platform.sendCommands(CommandGenerator.setLedIsOn(0xFE, true));
  // await platform.sendCommands(CommandGenerator.setTempLimit(0xFE, 50));
  // await platform.sendCommands(CommandGenerator.setVoltageLimits(0xFE));
  // await platform.sendCommands(CommandGenerator.setVoltageLimits(0xFE, { maxVolts: 5000 }));
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 0, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 1000, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 0, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 1000, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 0, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 1000, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 0, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 1000, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 0, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 1000, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 0, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 1000, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 0, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 1000, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 0, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 1000, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 0, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 1000, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 0, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 1000, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 0, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 1000, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 0, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 1000, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 0, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(0xFE, 1000, 0));
  // await wait(2000);
  // await platform.sendCommands(CommandGenerator.setMotorIsOn(5, false));
  // await platform.sendCommands(CommandGenerator.startMove(5));

  // await platform.sendCommands(CommandGenerator.setTargetAngleAndTime(3, 0, 0));
  // for (const id of [...Array(6).keys()].map(k => k + 1)) {
  //   // await platform.sendCommands(CommandGenerator.getId(id));
  //   await platform.sendCommands(CommandGenerator.getAngleLimits(id));
  //   await platform.sendCommands(CommandGenerator.getPosition(id));
  //   await platform.sendCommands(CommandGenerator.getLedIsOn(id));
  //   await platform.sendCommands(CommandGenerator.getLedAlarms(id));
  //   await platform.sendCommands(CommandGenerator.getVoltage(id));
  //   await platform.sendCommands(CommandGenerator.getAngleOffset(id));
  //   await platform.sendCommands(CommandGenerator.getTemp(id));
  //   await platform.sendCommands(CommandGenerator.getTempLimit(id));
  //   await platform.sendCommands(CommandGenerator.getVoltageLimits(id));
  //   await platform.sendCommands(CommandGenerator.getTargetAngleAndTime(id));
  //   await platform.sendCommands(CommandGenerator.getMotorIsOn(id));
  //   await platform.sendCommands(CommandGenerator.getMotorMode(id));
  //   console.log(`sent all read commands to servo ${id}`);
  // }

  // console.log(platform.servoState());
})();
