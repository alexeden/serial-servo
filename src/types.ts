export interface Servo {
  id: number;
  angle: number;
  minAngle: number;
  maxAngle: number;
  offset: number;
  volts: number;
  maxVolts: number;
  temp: number;
  maxTemp: number;
}
