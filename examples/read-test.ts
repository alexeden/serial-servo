import { ServoPlatform, CommandGenerator } from '../src';

(async () => {
  const platform = await ServoPlatform.ofPath('/dev/ttyAMA0');

  for (const id of [...Array(6).keys()].map(k => k + 1)) {
    await platform.sendCommand(CommandGenerator.getId(id));
    await platform.sendCommand(CommandGenerator.getAngleLimits(id));
    await platform.sendCommand(CommandGenerator.getPosition(id));
    await platform.sendCommand(CommandGenerator.getLedIsOn(id));
    await platform.sendCommand(CommandGenerator.getLedAlarms(id));
    await platform.sendCommand(CommandGenerator.getVoltage(id));
    await platform.sendCommand(CommandGenerator.getAngleOffset(id));
    await platform.sendCommand(CommandGenerator.getTemp(id));
    await platform.sendCommand(CommandGenerator.getTempLimit(id));
    await platform.sendCommand(CommandGenerator.getVoltageLimits(id));
    await platform.sendCommand(CommandGenerator.getTargetAngleAndTime(id));
    await platform.sendCommand(CommandGenerator.getMotorIsOn(id));
    await platform.sendCommand(CommandGenerator.getMotorMode(id));
  }

  console.log(platform.servoState());
})();
