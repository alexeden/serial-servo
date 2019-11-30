export type CommandType = 'W' | 'R';

// export interface Command {
//   value: number;
//   length: number;
//   type: CommandType;
// }

export enum Command {
  ServoMoveTimeWrite = 1,
  ServoMoveTimeRead = 2,
  ServoMoveTimeWaitWrite = 7,
  ServoMoveTimeWaitRead = 8,
  ServoMoveStart = 11,
  ServoMoveStop = 12,
  ServoIdWrite = 13,
  ServoIdRead = 14,
  ServoAngleOffsetAdjust = 17,
  ServoAngleOffsetWrite = 18,
  ServoAngleOffsetRead = 19,
  ServoAngleLimitWrite = 20,
  ServoAngleLimitRead = 21,
  ServoVinLimitWrite = 22,
  ServoVinLimitRead = 23,
  ServoTempMaxLimitWrite = 24,
  ServoTempMaxLimitRead = 25,
  ServoTempRead = 26,
  ServoVinRead = 27,
  ServoPosRead = 28,
  ServoOrMotorModeWrite = 29,
  ServoOrMotorModeRead = 30,
  ServoLoadOrUnloadWrite = 31,
  ServoLoadOrUnloadRead = 32,
  ServoLedCtrlWrite = 33,
  ServoLedCtrlRead = 34,
  ServoLedErrorWrite = 35,
  ServoLedErrorRead = 36,
}
