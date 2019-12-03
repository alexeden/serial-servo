import { ServoPlatform, CommandGenerator, Servo } from '../src';

(async () => {
  const platform = await ServoPlatform.ofPath('/dev/ttyAMA0');
  console.log('Sending ID read requests to all possible addresses');

  platform.on('newServo', async (servo: Servo) => {
    console.log(`Servo with ID ${servo.id} responded`);
    await new Promise(ok => setTimeout(ok, 500));

    // await platform.sendCommands(CommandGenerator.getId(servo.id));
    setTimeout(async () => {
      await platform.sendCommands(CommandGenerator.getAngleLimits(servo.id));
      await platform.sendCommands(CommandGenerator.getPosition(servo.id));
      await platform.sendCommands(CommandGenerator.getLedIsOn(servo.id));
      await platform.sendCommands(CommandGenerator.getLedAlarms(servo.id));
      await platform.sendCommands(CommandGenerator.getVoltage(servo.id));
      await platform.sendCommands(CommandGenerator.getAngleOffset(servo.id));
      await platform.sendCommands(CommandGenerator.getTemp(servo.id));
      await platform.sendCommands(CommandGenerator.getTempLimit(servo.id));
      await platform.sendCommands(CommandGenerator.getVoltageLimits(servo.id));
      await platform.sendCommands(CommandGenerator.getTargetAngleAndTime(servo.id));
      await platform.sendCommands(CommandGenerator.getMotorIsOn(servo.id));
      await platform.sendCommands(CommandGenerator.getMotorMode(servo.id));
    }, 1000 * servo.id);
  });


  await platform.scan();

  await new Promise(ok => setTimeout(ok, 500));

  console.log(JSON.stringify(platform.servoState(), null, 4));

  // for (const id of [...Array(6).keys()].map(k => k + 1)) {
  //   await platform.sendCommands(CommandGenerator.getId(id));
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
  // }

  // console.log(platform.servoState());
})();
