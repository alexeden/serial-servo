export const CommandHeader = 'UU';

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

export enum Response {
  ServoMoveTimeRead = 2,
  ServoMoveTimeWaitRead = 8,
  ServoIdRead = 14,
  ServoAngleOffsetRead = 19,
  ServoAngleLimitRead = 21,
  ServoVinLimitRead = 23,
  ServoTempMaxLimitRead = 25,
  ServoTempRead = 26,
  ServoVinRead = 27,
  ServoPosRead = 28,
  ServoOrMotorModeRead = 30,
  ServoLoadOrUnloadRead = 32,
  ServoLedCtrlRead = 34,
  ServoLedErrorRead = 36,
}


// tslint:disable-next-line: cyclomatic-complexity
export const commandDataLength = (command: Command): number => {
  switch (command) {
    case Command.ServoMoveTimeRead:
    case Command.ServoMoveTimeWaitRead:
    case Command.ServoMoveStart:
    case Command.ServoMoveStop:
    case Command.ServoIdRead:
    case Command.ServoAngleOffsetWrite:
    case Command.ServoAngleOffsetRead:
    case Command.ServoAngleLimitRead:
    case Command.ServoVinLimitRead:
    case Command.ServoTempMaxLimitRead:
    case Command.ServoTempRead:
    case Command.ServoVinRead:
    case Command.ServoPosRead:
    case Command.ServoOrMotorModeRead:
    case Command.ServoLoadOrUnloadRead:
    case Command.ServoLedCtrlRead:
    case Command.ServoLedErrorRead:
      return 3;

    case Command.ServoIdWrite:
    case Command.ServoAngleOffsetAdjust:
    case Command.ServoTempMaxLimitWrite:
    case Command.ServoLoadOrUnloadWrite:
    case Command.ServoLedCtrlWrite:
    case Command.ServoLedErrorWrite:
      return 4;

    case Command.ServoMoveTimeWrite:
    case Command.ServoMoveTimeWaitWrite:
    case Command.ServoAngleLimitWrite:
    case Command.ServoVinLimitWrite:
    case Command.ServoOrMotorModeWrite:
      return 7;
  }
};

// tslint:disable-next-line: cyclomatic-complexity
export const responseDataLength = (response: Response): number => {
  switch (response) {
    case Response.ServoIdRead:
    case Response.ServoAngleOffsetRead:
    case Response.ServoTempMaxLimitRead:
    case Response.ServoTempRead:
    case Response.ServoLoadOrUnloadRead:
    case Response.ServoLedCtrlRead:
    case Response.ServoLedErrorRead:
      return 4;

    case Response.ServoVinRead:
    case Response.ServoPosRead:
      return 5;

    case Response.ServoMoveTimeRead:
    case Response.ServoMoveTimeWaitRead:
    case Response.ServoAngleLimitRead:
    case Response.ServoVinLimitRead:
    case Response.ServoOrMotorModeRead:
      return 7;
  }
};
