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
  /**
   * Maximum temperature, in degrees Celsius
   * Range: 50 to 100
   */
  maxTemp?: number;
  /**
   * Maximum voltage, in millivolts
   * Range: 6500 to 12000
   */
  maxVolts?: number;
  minAngle?: number;
  motorOn?: boolean;
  motorMode?: MotorMode;
  /**
   * Current move time to reach target angle, in milliseconds
   * Range: 0 to 30000
   */
  moveTime?: number;
  /**
   * Current deviation angle, in degrees
   * Range: -125 to 125
   */
  offsetAngle?: number;
  presetTargetAngle?: number;
  /**
   * Preset move time to reach preset target angle, in milliseconds
   * Range: 0 to 30000
   */
  presetMoveTime?: number;
  rotationSpeed?: number;
  targetAngle?: number;
  /**
   * Current temperature, in degrees Celsius
   * Range: 50 to 100
   */
  temp?: number;
  /**
   * Current voltage, in millivolts
   * Range: 6500 to 10000
   */
  volts?: number;
}
