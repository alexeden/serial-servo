export enum MotorMode {
  Servo,
  Motor,
}

export enum MotorState {
  Off,
  On,
}

export enum LedState {
  Off,
  On,
}

export enum Alarm {
  None,
  OverHeat,
  OverVoltage,
  OverHeatAndVoltage,
  Stalled,
  OverHeatAndStalled,
  OverVoltageAndStalled,
  OverHeatAndVoltageAndStalled,
}

export interface Servo {
  angle?: number;
  id: number;
  ledAlarms?: Alarm;
  ledOn?: boolean;
  maxAngle?: number;
  maxTemp?: number;
  maxVolts?: number;
  minAngle?: number;
  motorOn?: boolean;
  motorMode?: MotorMode;
  moveTime?: number;
  moveWaitTime?: number;
  offsetAngle?: number;
  targetAngle?: number;
  rotationSpeed?: number;
  temp?: number;
  volts?: number;
}
